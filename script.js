
async function encryptPage(password) {
  try {
    // 1. Derive a key from the password using PBKDF2
    const encoder = new TextEncoder(2662);
    const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const key = await crypto.subtle.importKey(
      { name: 'PBKDF2' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    // 2. Generate a random initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 3. Encrypt the page content
    const pageContent = document.documentElement.outerHTML; // Get the entire HTML
    const encodedContent = encoder.encode(pageContent);
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encodedContent
    );

    // 4. Convert the ciphertext and IV to Base64 for storage or transmission
    const base64Ciphertext = btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));
    const base64IV = btoa(String.fromCharCode.apply(null, iv));

    // 5. Store or transmit the ciphertext and IV (e.g., in local storage or send to a server)
    localStorage.setItem('encryptedPage', base64Ciphertext);
    localStorage.setItem('iv', base64IV);

    console.log("Page encrypted and stored.");

  } catch (error) {
    console.error("Encryption failed:", error);
  }
}
