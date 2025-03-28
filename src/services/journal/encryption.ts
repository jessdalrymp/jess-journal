
import * as CryptoJS from 'crypto-js';

/**
 * Encrypts content using AES with a user-specific key
 */
export const encryptContent = (content: string, userId: string): string => {
  try {
    // Use the userId as part of the encryption key for user-specific encryption
    const encryptionKey = `jess_journal_${userId}`;
    return CryptoJS.AES.encrypt(content, encryptionKey).toString();
  } catch (error) {
    console.error('Error encrypting content:', error);
    // Return original content if encryption fails to prevent data loss
    return content;
  }
};

/**
 * Decrypts content using the same user-specific key
 */
export const decryptContent = (encryptedContent: string, userId: string): string => {
  try {
    const encryptionKey = `jess_journal_${userId}`;
    const bytes = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting content:', error);
    return encryptedContent; // Return original content if decryption fails
  }
};
