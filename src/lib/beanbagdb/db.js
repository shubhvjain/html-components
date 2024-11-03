import { BeanBagDB,DocNotFoundError ,DocCreationError} from "beanbagdb";

import * as PouchDB from "./pouchdb.min.js";
import * as PouchDBFind from "./pouchdb.find.js";

// this is a pouch db instance of beanbagdb used for testing.
import Ajv from "ajv";

//PouchDB.plugin(pouchdbFind);

let pdb;

export const get_pdb_doc = (dbname, secret) => {
  //window.PouchDB.plugin(PouchDBFind)
  pdb = new window.PouchDB(dbname);
  //console.log(pdb)
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
      encrypt: async (text, encryptionKey) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text); // Encode the text into bytes
    
        // Ensure the encryption key is of valid length (16, 24, or 32 bytes for AES-GCM)
        const keyBytes = encoder.encode(encryptionKey);
        if (keyBytes.length !== 16 && keyBytes.length !== 24 && keyBytes.length !== 32) {
            throw new Error("Encryption key must be 16, 24, or 32 bytes long.");
        }
    
        // Convert encryptionKey to CryptoKey
        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );
    
        // Create a random initialization vector (IV)
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM
    
        // Encrypt the data
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );
    
        // Convert encrypted data and IV to base64 for storage
        const encryptedArray = new Uint8Array(encrypted);
        const encryptedText = btoa(String.fromCharCode(...encryptedArray));
        const ivText = btoa(String.fromCharCode(...iv));
    
        return ivText + ":" + encryptedText; // Store IV and encrypted text together
      },
      decrypt: async (encryptedText, encryptionKey) => {
        const [ivText, encryptedData] = encryptedText.split(":");

        // Convert IV and encrypted data from base64 to byte arrays
        const iv = Uint8Array.from(atob(ivText), (c) => c.charCodeAt(0));
        const encryptedArray = Uint8Array.from(atob(encryptedData), (c) =>
          c.charCodeAt(0)
        );

        const encoder = new TextEncoder();

        // Convert encryptionKey to CryptoKey
        const key = await window.crypto.subtle.importKey(
          "raw",
          encoder.encode(encryptionKey),
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );

        // Decrypt the data
        const decrypted = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
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

export const get_new_DB = (db) => {
  //console.log(db)
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

export const get_ready_DB = async (db) =>{
  // this gives you a ready database instance. also making sure all ui settings are also done
  try {
    //console.log(db)
    let bbdb = get_new_DB(db)
    await bbdb.ready()
    await make_db_ui_ready(bbdb)
    return bbdb    
  } catch (error) {
    throw error
    console.log(error)
  }

}

const instance_check = (db)=>{
  if (!(db instanceof BeanBagDB)){
    throw new Error("BeanBagDB instance required")
  }
}

const required_schemas = [
  {
    name: "system_ai_prompts",
    description:
      "To store AI prompt to help you generate data for a certain schema using LLM",
    version: 1,
    schema: {
      additionalProperties: false,
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the prompt",
          minLength: 1,
        },
        content: {
          type: "string",
          description: "The content of the prompt",
          minLength: 1,
        },
        database: {
          type: "string",
          description: "Name of the database associated with the prompt",
          minLength: 1,
        },
      },
      required: ["name", "content", "database"],
    },
    settings: {
      primary_keys: ["name"],
      encrypted_fields: [],
      non_editable_fields: [],
    },
  },
];


const required_records = [
  {
    schema: "system_key",
    data: {
      name: "YOUR_OPENAI_API_KEY",
      value: "change_this_later",
      note: "this_is_required_to_use_the_AI_Assistant"
    },
    meta:{
      tags:["added_by_system","ai_assistant"]
    },
     title: "key required for AI assistant "
  }
];

const  make_db_ui_ready = async (db)=>{
  instance_check(db)
  let final_logs = [`ui schema check started`]
  for (let index = 0; index < required_schemas.length; index++) {
    const element = required_schemas[index];
    let s_logs = await update_schema_if_exists(db,element)
    final_logs = [...final_logs,...s_logs]
  }

  final_logs.push(`ui default records check started`)
  for (let index = 0; index < required_records.length; index++) {
    const element = required_records[index];
    let r_logs = await insert_if_not_there(db,element.title,element.schema,element.data,element.meta)
    final_logs = [...final_logs,...r_logs]
  }
  console.log(JSON.stringify(final_logs,null,2))
  if(final_logs.length>2){
    // update the logs
    await db.save_setting_doc("system_logs", {
      value: { text: final_logs.join(","), added: db.util_get_now_unix_timestamp() },
      on_update_array: "append",
    })
  }
}


const update_schema_if_exists = async (db,new_schema) => {
  // updates the schema based on version number
  let logs = []
  try {
    let schema = await db.get("schema",{"name":new_schema.name})
    if (schema.data.version != new_schema.version){
      logs.push(`version mismatch for ${new_schema.name}: db: ${schema.data.version},code:${new_schema.version}`)
      try {
        let update_schema = await db.update({"schema":"schema",data:{name:new_schema.name}},new_schema)
        logs.push(`version updated`)
      } catch (error1) {
        console.log(error1)
        logs.push(`error in updating schema: '${new_schema.name}': ${error1.message} `)
      }
    }
  } catch (error) {
    console.log(error)
    if (error instanceof DocNotFoundError){
      // create a new document
      logs.push(`schema ${new_schema.name} not found, creating one`)
      try {
        let new_doc = await db.create("schema",new_schema)
        logs.push("created successfully")
      } catch (error2) {
        logs.push(`error in creating schema '${new_schema.name}' : ${error2.message}`)
       console.log("Error in creating database ") 
       console.log(error2)
      }
    }
  }
  return logs
};

const insert_if_not_there = async(db,title,schema,data,meta)=>{
  console.log(schema,data,meta)
 let logs = []
  try {
    let new_doc = await db.create(schema,data,meta)
    logs.push(`doc ${title} created successfully`)
  } catch (error) {
    //console.log(error)
    if(!(error instanceof DocCreationError)){
      logs.push(`error in doc insertion: ${error.message}, doc: ${JSON.stringify(data)}`)
    }
  }
 return logs
}
