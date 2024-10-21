import { BeanBagDB } from "beanbagdb";

// this is a pouch db instance of beanbagdb used for testing.
import Ajv from "ajv";

import PouchDB from "pouchdb-browser";
import pouchdbFind from "pouchdb-find";
PouchDB.plugin(pouchdbFind);
import {
  scryptSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "crypto";

let pdb

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
      encrypt: (text, encryptionKey) => {
        const key = scryptSync(encryptionKey, "salt", 32); // Derive a 256-bit key
        const iv = randomBytes(16); // Initialization vector
        const cipher = createCipheriv("aes-256-cbc", key, iv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return iv.toString("hex") + ":" + encrypted; // Prepend the IV for decryption
      },
      decrypt: (encryptedText, encryptionKey) => {
        const key = scryptSync(encryptionKey, "salt", 32); // Derive a 256-bit key
        const [ivHex, encryptedHex] = encryptedText.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const encrypted = Buffer.from(encryptedHex, "hex");
        const decipher = createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
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


