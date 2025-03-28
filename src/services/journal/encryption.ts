
import * as CryptoJS from 'crypto-js';

/**
 * Encrypts content using AES with a user-specific key
 */
export const encryptContent = (content: string, userId: string): string => {
  try {
    // Skip encryption if content is empty to prevent errors
    if (!content || !content.trim()) {
      console.warn('Attempted to encrypt empty content');
      return content;
    }
    
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
  if (!encryptedContent || !encryptedContent.trim()) {
    console.warn('Attempted to decrypt empty content');
    return encryptedContent;
  }
  
  try {
    const encryptionKey = `jess_journal_${userId}`;
    const bytes = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
    const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption results in empty string, return the original content
    if (!decryptedContent || decryptedContent.trim() === '') {
      console.warn('Decryption resulted in empty content, using original content');
      return encryptedContent;
    }
    
    return decryptedContent;
  } catch (error) {
    console.error('Error decrypting content:', error);
    
    // More detailed error for debugging
    if (encryptedContent.length < 20) {
      console.warn('Suspicious encrypted content (too short):', encryptedContent);
    }
    
    return encryptedContent; // Return original content if decryption fails
  }
};
