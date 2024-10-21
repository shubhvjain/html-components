import { BeanBagDB } from "beanbagdb";

// this is a pouch db instance of beanbagdb used for testing.
import Ajv from "ajv";

import PouchDB from "pouchdb-browser";
import pouchdbFind from "pouchdb-find";
PouchDB.plugin(pouchdbFind);

let pdb

async function encrypt(text, encryptionKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Convert encryptionKey to CryptoKey
  const key = await window.crypto.subtle.importKey(
      'raw', 
      encoder.encode(encryptionKey), 
      { name: 'AES-GCM' },
      false,
      ['encrypt']
  );

  // Create a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data
  const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
  );

  // Convert encrypted data and IV to base64 for storage
  const encryptedArray = new Uint8Array(encrypted);
  const encryptedText = btoa(String.fromCharCode(...encryptedArray));
  const ivText = btoa(String.fromCharCode(...iv));

  return ivText + ':' + encryptedText; // Store IV and encrypted text together
}


async function decrypt(encryptedText, encryptionKey) {
  const [ivText, encryptedData] = encryptedText.split(':');

  // Convert IV and encrypted data from base64 to byte arrays
  const iv = Uint8Array.from(atob(ivText), c => c.charCodeAt(0));
  const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

  const encoder = new TextEncoder();

  // Convert encryptionKey to CryptoKey
  const key = await window.crypto.subtle.importKey(
      'raw', 
      encoder.encode(encryptionKey), 
      { name: 'AES-GCM' },
      false,
      ['decrypt']
  );

  // Decrypt the data
  const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedArray
  );

  // Convert decrypted data back to a string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}



export const get_pdb_doc = (dbname, secret) => {
  pdb = new PouchDB(dbname);
  console.log(pdb)
  const doc_obj = {
    name: dbname,
    db_name: "pouchdb",
    encryption_key: secret,
    api: {
      insert: async (doc) => {
        const result = await pdb.post(doc);
        return result;
      },
      // delete: ()=>{db1.destroy},
      update: async (doc) => {
        const result = await pdb.put(doc);
        return result;
      },
      search: async (query) => {
        const results = await pdb.find(query);
        return results; // of the form {docs:[],...}
      },
      get: async (id) => {
        const data = await pdb.get(id);
        return data;
      },
      delete: async (id) => {
        const doc = await pdb.get(id);
        const resp = await pdb.remove(doc);
        return resp;
      },
      createIndex: async (filter) => {
        const data = await pdb.createIndex(filter);
        return data;
      },
    },
    utils: {
      encrypt: async (text, encryptionKey)=> {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
      
        // Convert encryptionKey to CryptoKey
        const key = await window.crypto.subtle.importKey(
            'raw', 
            encoder.encode(encryptionKey), 
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );
      
        // Create a random initialization vector (IV)
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
        // Encrypt the data
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
      
        // Convert encrypted data and IV to base64 for storage
        const encryptedArray = new Uint8Array(encrypted);
        const encryptedText = btoa(String.fromCharCode(...encryptedArray));
        const ivText = btoa(String.fromCharCode(...iv));
      
        return ivText + ':' + encryptedText; // Store IV and encrypted text together
      },
      decrypt: async(encryptedText, encryptionKey) => {
        const [ivText, encryptedData] = encryptedText.split(':');
      
        // Convert IV and encrypted data from base64 to byte arrays
        const iv = Uint8Array.from(atob(ivText), c => c.charCodeAt(0));
        const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
        const encoder = new TextEncoder();
      
        // Convert encryptionKey to CryptoKey
        const key = await window.crypto.subtle.importKey(
            'raw', 
            encoder.encode(encryptionKey), 
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );
      
        // Decrypt the data
        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptedArray
        );
      
        // Convert decrypted data back to a string
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
      },
      ping: () => {
        // @TODO ping the database to check connectivity when class is ready to use
      },
      validate_schema: (schema_obj, data_obj) => {
        const ajv = new Ajv({ code: { esm: true } }); // options can be passed, e.g. {allErrors: true}
        const validate = ajv.compile(schema_obj);
        const valid = validate(data_obj);
        return { valid, validate };
      },
    },
  };
  return doc_obj;
};

export const getNewDB = (db) => {
  if (!db.name) {
    throw new Error("No DB name was provided");
  }
  if (!db.encryption_key) {
    throw new Error("No encryption key was provided");
  }
  let doc_obj = get_pdb_doc(db.name, db.encryption_key);
  let database = new BeanBagDB(doc_obj);
  return database;
};


