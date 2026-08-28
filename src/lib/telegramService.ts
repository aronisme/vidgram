/**
 * Telegram Bot API Service for Vidgram
 * Provides high-level helper functions to interact with Telegram Bot API
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables.');
  }
  return token;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface SendMessageOptions {
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_to_message_id?: number;
  reply_markup?: {
    inline_keyboard?: InlineKeyboardButton[][];
  };
  disable_web_page_preview?: boolean;
}

export interface SendVideoOptions extends SendMessageOptions {
  caption?: string;
  duration?: number;
  width?: number;
  height?: number;
  supports_streaming?: boolean;
}

export interface SendAudioOptions extends SendMessageOptions {
  caption?: string;
  title?: string;
  performer?: string;
  duration?: number;
}

export interface InputMediaItem {
  type: 'photo' | 'video';
  media: string;
  caption?: string;
  parse_mode?: 'HTML' | 'Markdown';
}

export const telegramService = {
  /**
   * Generic API call to Telegram Bot API
   */
  async callApi(method: string, payload: Record<string, any>): Promise<any> {
    const token = getBotToken();
    const url = `${TELEGRAM_API_BASE}/bot${token}/${method}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error(`[telegramService] ${method} failed:`, data);
      throw new Error(data.description || `Telegram API error: ${method}`);
    }
    return data.result;
  },

  /**
   * Test Bot Token validity & get info
   */
  async getMe() {
    return this.callApi('getMe', {});
  },

  /**
   * Set Webhook URL
   */
  async setWebhook(url: string, secretToken?: string) {
    const payload: Record<string, any> = {
      url,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: false,
    };
    if (secretToken) {
      payload.secret_token = secretToken;
    }
    return this.callApi('setWebhook', payload);
  },

  /**
   * Delete Webhook (switch to long-polling)
   */
  async deleteWebhook() {
    return this.callApi('deleteWebhook', { drop_pending_updates: false });
  },

  /**
   * Check Webhook Info
   */
  async getWebhookInfo() {
    return this.callApi('getWebhookInfo', {});
  },

  /**
   * Send chat action (e.g. typing, upload_video, upload_document)
   */
  async sendChatAction(chatId: number | string, action: 'typing' | 'upload_video' | 'upload_photo' | 'upload_document' | 'upload_voice') {
    try {
      return await this.callApi('sendChatAction', {
        chat_id: chatId,
        action,
      });
    } catch (e) {
      // Chat actions are non-critical
      return null;
    }
  },

  /**
   * Send a text message
   */
  async sendMessage(chatId: number | string, text: string, options?: SendMessageOptions) {
    return this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options?.parse_mode ?? 'HTML',
      reply_to_message_id: options?.reply_to_message_id,
      reply_markup: options?.reply_markup,
      disable_web_page_preview: options?.disable_web_page_preview ?? false,
    });
  },

  /**
   * Edit an existing message
   */
  async editMessageText(chatId: number | string, messageId: number, text: string, options?: SendMessageOptions) {
    try {
      return await this.callApi('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: options?.parse_mode ?? 'HTML',
        reply_markup: options?.reply_markup,
        disable_web_page_preview: options?.disable_web_page_preview ?? false,
      });
    } catch (e) {
      console.warn('[telegramService] editMessageText failed:', e);
      return null;
    }
  },

  /**
   * Delete a message
   */
  async deleteMessage(chatId: number | string, messageId: number) {
    try {
      return await this.callApi('deleteMessage', {
        chat_id: chatId,
        message_id: messageId,
      });
    } catch (e) {
      return null;
    }
  },

  /**
   * Send Video (Tries direct URL first, fallbacks to binary stream if Telegram rejects CDN url)
   */
  async sendVideo(chatId: number | string, videoUrl: string, options?: SendVideoOptions) {
    try {
      return await this.callApi('sendVideo', {
        chat_id: chatId,
        video: videoUrl,
        caption: options?.caption,
        parse_mode: options?.parse_mode ?? 'HTML',
        reply_to_message_id: options?.reply_to_message_id,
        reply_markup: options?.reply_markup,
        supports_streaming: options?.supports_streaming ?? true,
      });
    } catch (directErr: any) {
      console.warn('[telegramService] sendVideo direct URL failed, streaming buffer...', directErr.message);
      // Binary streaming fallback
      return this.sendMediaByStream('sendVideo', 'video', chatId, videoUrl, 'video.mp4', 'video/mp4', options);
    }
  },

  /**
   * Send Audio (MP3)
   */
  async sendAudio(chatId: number | string, audioUrl: string, options?: SendAudioOptions) {
    try {
      return await this.callApi('sendAudio', {
        chat_id: chatId,
        audio: audioUrl,
        caption: options?.caption,
        title: options?.title,
        performer: options?.performer,
        parse_mode: options?.parse_mode ?? 'HTML',
        reply_to_message_id: options?.reply_to_message_id,
        reply_markup: options?.reply_markup,
      });
    } catch (directErr: any) {
      console.warn('[telegramService] sendAudio direct URL failed, streaming buffer...', directErr.message);
      return this.sendMediaByStream('sendAudio', 'audio', chatId, audioUrl, 'audio.mp3', 'audio/mpeg', options);
    }
  },

  /**
   * Send Photo
   */
  async sendPhoto(chatId: number | string, photoUrl: string, options?: SendMessageOptions & { caption?: string }) {
    try {
      return await this.callApi('sendPhoto', {
        chat_id: chatId,
        photo: photoUrl,
        caption: options?.caption,
        parse_mode: options?.parse_mode ?? 'HTML',
        reply_to_message_id: options?.reply_to_message_id,
        reply_markup: options?.reply_markup,
      });
    } catch (e) {
      return this.sendMediaByStream('sendPhoto', 'photo', chatId, photoUrl, 'photo.jpg', 'image/jpeg', options);
    }
  },

  /**
   * Send multiple photos/videos as a media album
   */
  async sendMediaGroup(chatId: number | string, media: InputMediaItem[], replyToMessageId?: number) {
    return this.callApi('sendMediaGroup', {
      chat_id: chatId,
      media: media.slice(0, 10), // Telegram limit: max 10 per album
      reply_to_message_id: replyToMessageId,
    });
  },

  /**
   * Acknowledge/Answer Callback Query (when user clicks an inline button)
   */
  async answerCallbackQuery(callbackQueryId: string, text?: string, showAlert = false) {
    return this.callApi('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    });
  },

  /**
   * Helper: Stream media file directly to Telegram Bot API when direct URL fetching fails
   */
  async sendMediaByStream(
    apiMethod: string,
    fileField: string,
    chatId: number | string,
    mediaUrl: string,
    fileName: string,
    mimeType: string,
    options?: any
  ) {
    const token = getBotToken();
    const downloadRes = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!downloadRes.ok) {
      throw new Error(`Gagal mendownload media dari server asal: ${downloadRes.status}`);
    }

    const blob = await downloadRes.blob();
    const formData = new FormData();
    formData.append('chat_id', String(chatId));
    formData.append(fileField, blob, fileName);

    if (options?.caption) formData.append('caption', options.caption);
    if (options?.parse_mode) formData.append('parse_mode', options.parse_mode);
    if (options?.title) formData.append('title', options.title);
    if (options?.performer) formData.append('performer', options.performer);
    if (options?.reply_to_message_id) formData.append('reply_to_message_id', String(options.reply_to_message_id));
    if (options?.reply_markup) formData.append('reply_markup', JSON.stringify(options.reply_markup));

    const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/${apiMethod}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.description || 'Gagal mengirim file ke Telegram');
    }
    return result.result;
  },
};
