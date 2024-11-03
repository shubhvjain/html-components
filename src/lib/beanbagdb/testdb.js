import { get_ready_DB } from "./db.js";
import { DocCreationError } from "beanbagdb";

export const get_test_db = async (db=null)=>{
  if(!db){
    db = {name: "test_storybook10",encryption_key: "SampleKeyForTesting12345"}
  }
  let bbdb = await get_ready_DB(db)
  return bbdb
}

export const add_test_data = async (BBDB) => {

  // taken from  : https://json-schema.org/learn/json-schema-examples
  const schemas = [
    {
      name: "contact",
      description: "An address similar to http://microformats.org/wiki/h-card",
      version: 2,
      schema: {
        additionalProperties:false,
        "type": "object",
        "properties": {
          "postOfficeBox": {
            "type": "string"
          },
          "extendedAddress": {
            "type": "string"
          },
          "streetAddress": {
            "type": "string"
          },
          "locality": {
            "type": "string"
          },
          "region": {
            "type": "string"
          },
          "postalCode": {
            "type": "string"
          },
          "countryName": {
            "type": "string"
          }
        },
        "required": [ "locality", "region", "countryName" ],
      },
      settings : {
        primary_keys:[],
        encrypted_fields:[],
        non_editable_fields:[],
        single_record:false
      }
      
    },
    {
      name: "blog_post",
      version: 1,
      description: "A representation of a blog post",
      schema : {
        additionalProperties:false,
        type: "object",
        "required": ["title", "content", "author"],
        "properties": {
          "title": {
            "type": "string"
          },
          "content": {
            "type": "string"
          },
          "publishedDate": {
            "type": "string",
           
          }
        }
      },
      settings : {
        primary_keys:["title"],
        encrypted_fields:[],
        non_editable_fields:[],
        single_record:false
      }
      
    },
    {
      name: "location",
      version: 1,
      description: "A geographical coordinate.",
      schema : {
        "title": "Longitude and Latitude Values",
        additionalProperties:false,
        "required": [ "latitude", "longitude" ],
        "type": "object",
        "properties": {
          "name":{
            type:"string"
          },
          "latitude": {
            "type": "number",
            "minimum": -90,
            "maximum": 90
          },
          "longitude": {
            "type": "number",
            "minimum": -180,
            "maximum": 180
          }
        }
      },
      settings : {
        primary_keys:["latitude","longitude"],
        encrypted_fields:[],
        non_editable_fields:[],
        single_record:false
      }  
    },
    {
      name: "movie",
      version: 1,
      description: "A representation of a movie",
      schema : {
        additionalProperties:true,
        "type": "object",
        "required": ["title", "director", "releaseDate"],
        "properties": {
          "title": {
            "type": "string"
          },
          "director": {
            "type": "string"
          },
          "releaseDate": {
            "type": "string",
          
          },
          "genre": {
            "type": "string",
            "enum": ["Action", "Comedy", "Drama", "Science Fiction"]
          },
          "duration": {
            "type": "string"
          },
          "cast": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      settings : {
        primary_keys:['title'],
        encrypted_fields:[],
        non_editable_fields:[],
        single_record:false
      }
    }
  ];
  const records = 
    [
      {
        "schema": "contact",
        "data": {
          "locality": "San Francisco",
          "region": "CA",
          "countryName": "USA"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Toronto",
          "region": "ON",
          "countryName": "Canada",
          "postalCode": "M5H 2N2"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Berlin",
          "region": "BE",
          "countryName": "Germany",
          "streetAddress": "Friedrichstrasse 123",
          "postalCode": "10117"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Paris",
          "region": "Île-de-France",
          "countryName": "France",
          "streetAddress": "10 Rue de Rivoli",
          "extendedAddress": "Apartment 3A",
          "postalCode": "75001"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Sydney",
          "region": "NSW",
          "countryName": "Australia",
          "streetAddress": "1 Circular Quay",
          "postOfficeBox": "PO Box 123",
          "postalCode": "2000"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Tokyo",
          "region": "Tokyo",
          "countryName": "Japan",
          "streetAddress": "1 Chome-1-2 Oshiage",
          "extendedAddress": "Building 1",
          "postalCode": "131-0045"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "New York",
          "region": "NY",
          "countryName": "USA",
          "streetAddress": "350 5th Ave",
          "postOfficeBox": "PO Box 3456",
          "postalCode": "10118"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Mexico City",
          "region": "CDMX",
          "countryName": "Mexico",
          "streetAddress": "Av. Paseo de la Reforma 123",
          "postalCode": "06600"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Cape Town",
          "region": "Western Cape",
          "countryName": "South Africa",
          "streetAddress": "Dock Road",
          "postOfficeBox": "PO Box 789",
          "postalCode": "8001"
        }
      },
      {
        "schema": "contact",
        "data": {
          "locality": "Mumbai",
          "region": "MH",
          "countryName": "India",
          "streetAddress": "Nariman Point",
          "extendedAddress": "Office 42",
          "postalCode": "400021"
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Exploring the Future of AI",
          "content": "In this post, we explore the latest advancements in artificial intelligence and what the future might hold.",
          "author": "Jane Doe",
          "publishedDate": "2024-11-01T10:00:00Z",
          "tags": ["AI", "technology", "future"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "A Guide to Healthy Eating",
          "content": "Eating healthy doesn't have to be difficult. Here are some simple tips to improve your diet.",
          "author": "John Smith",
          "publishedDate": "2024-10-15T08:30:00Z",
          "tags": ["health", "nutrition", "wellness"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Traveling on a Budget",
          "content": "Discover ways to travel the world without breaking the bank. Budget tips, best destinations, and more!",
          "author": "Emily Clark",
          "publishedDate": "2024-09-10T12:00:00Z",
          "tags": ["travel", "budget", "adventure"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Top JavaScript Frameworks in 2024",
          "content": "An overview of the top JavaScript frameworks this year and why developers are using them.",
          "author": "Michael Chen",
          "publishedDate": "2024-08-25T14:45:00Z",
          "tags": ["JavaScript", "programming", "web development"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Mindfulness for Stress Management",
          "content": "Learn how mindfulness techniques can help you manage stress and improve mental well-being.",
          "author": "Sophia Nguyen",
          "publishedDate": "2024-07-30T09:20:00Z",
          "tags": ["mindfulness", "mental health", "wellness"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "The Art of Minimalism",
          "content": "Minimalism is more than just an aesthetic. Discover the lifestyle and its benefits.",
          "author": "Liam Brown",
          "publishedDate": "2024-07-15T13:00:00Z",
          "tags": ["minimalism", "lifestyle", "simplicity"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Best Practices in Remote Work",
          "content": "With remote work becoming the norm, here are some best practices to stay productive and connected.",
          "author": "Olivia Green",
          "publishedDate": "2024-06-20T16:10:00Z",
          "tags": ["remote work", "productivity", "business"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Understanding Cryptocurrency",
          "content": "Cryptocurrency is changing the financial landscape. Here's what you need to know to get started.",
          "author": "Daniel King",
          "publishedDate": "2024-05-22T10:50:00Z",
          "tags": ["cryptocurrency", "finance", "blockchain"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Home Gardening Basics",
          "content": "Want to start a garden at home? Here are some basics to get you started on the right foot.",
          "author": "Mia Patel",
          "publishedDate": "2024-04-12T11:30:00Z",
          "tags": ["gardening", "home", "DIY"]
        }
      },
      {
        "schema": "blog_post",
        "data": {
          "title": "Mastering Time Management",
          "content": "Time management is key to productivity. Here are some techniques to help you make the most of your day.",
          "author": "Ethan Lee",
          "publishedDate": "2024-03-05T07:45:00Z",
          "tags": ["time management", "productivity", "self-help"]
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Eiffel Tower",
          "latitude": 48.8584,
          "longitude": 2.2945
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Statue of Liberty",
          "latitude": 40.6892,
          "longitude": -74.0445
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Sydney Opera House",
          "latitude": -33.8568,
          "longitude": 151.2153
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Great Wall of China",
          "latitude": 40.4319,
          "longitude": 116.5704
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Machu Picchu",
          "latitude": -13.1631,
          "longitude": -72.5450
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Mount Everest",
          "latitude": 27.9881,
          "longitude": 86.9250
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Pyramids of Giza",
          "latitude": 29.9792,
          "longitude": 31.1342
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Christ the Redeemer",
          "latitude": -22.9519,
          "longitude": -43.2105
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Taj Mahal",
          "latitude": 27.1751,
          "longitude": 78.0421
        }
      },
      {
        "schema": "location",
        "data": {
          "name": "Big Ben",
          "latitude": 51.5007,
          "longitude": -0.1246
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "Inception",
          "director": "Christopher Nolan",
          "releaseDate": "2010-07-16",
          "genre": "Science Fiction",
          "duration": "2h 28m",
          "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "The Grand Budapest Hotel",
          "director": "Wes Anderson",
          "releaseDate": "2014-03-28",
          "genre": "Comedy",
          "duration": "1h 39m",
          "cast": ["Ralph Fiennes", "F. Murray Abraham", "Mathieu Amalric", "Adrien Brody"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "The Shawshank Redemption",
          "director": "Frank Darabont",
          "releaseDate": "1994-09-22",
          "genre": "Drama",
          "duration": "2h 22m",
          "cast": ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "Mad Max: Fury Road",
          "director": "George Miller",
          "releaseDate": "2015-05-15",
          "genre": "Action",
          "duration": "2h",
          "cast": ["Tom Hardy", "Charlize Theron", "Nicholas Hoult", "Hugh Keays-Byrne"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "Interstellar",
          "director": "Christopher Nolan",
          "releaseDate": "2014-11-07",
          "genre": "Science Fiction",
          "duration": "2h 49m",
          "cast": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "The Dark Knight",
          "director": "Christopher Nolan",
          "releaseDate": "2008-07-18",
          "genre": "Action",
          "duration": "2h 32m",
          "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "Forrest Gump",
          "director": "Robert Zemeckis",
          "releaseDate": "1994-07-06",
          "genre": "Drama",
          "duration": "2h 22m",
          "cast": ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "Back to the Future",
          "director": "Robert Zemeckis",
          "releaseDate": "1985-07-03",
          "genre": "Science Fiction",
          "duration": "1h 56m",
          "cast": ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson", "Crispin Glover"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "The Godfather",
          "director": "Francis Ford Coppola",
          "releaseDate": "1972-03-24",
          "genre": "Drama",
          "duration": "2h 55m",
          "cast": ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"]
        }
      },
      {
        "schema": "movie",
        "data": {
          "title": "Guardians of the Galaxy",
          "director": "James Gunn",
          "releaseDate": "2014-08-01",
          "genre": "Science Fiction",
          "duration": "2h 1m",
          "cast": ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Vin Diesel"]
        }
      }

  ]
  
  await BBDB.ready()

  for (let index = 0; index < schemas.length; index++) {
    const element = schemas[index];
    try {
      
      let rec = await BBDB.create("schema",element)
      console.log(rec)  
    } catch (error) {
      console.log(error)
      if (error instanceof DocCreationError){
        // update the doc instead 
        try {
          let a = await BBDB.update({"schema":"schema","data":{"name":element["name"]}},{schema:element["schema"]})
          console.log(a)  
        } catch (error1) {
          console.log("updating error")
          console.log(error1)
        } 
      }
    }  
  }
  let a = records.length
  for (let index = 0; index < a; index++) {
    try {
      console.log(index)
      const element = records[index];
      console.log(element)
      let rec = await BBDB.create(element.schema,element.data)
      //console.log(rec)  
      //console.log(index)
    } catch (error) {
      console.log("error creating rec")
      console.log(error)
    }  
    console.log(index)
  }
};
