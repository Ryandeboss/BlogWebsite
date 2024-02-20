// blogPost.js

class days {
  constructor(title, content) {
    this.title = title;
    this.text = content;
    this.TrunkatedText = content.slice(0, 100)
    this.urlName = title.replace(/ /g, '_');
  }
  static async AddDay(client, title, content) {
    try {
      const db = client.db('BlogWeb');
      const collection = db.collection('blog');

      // Create a new days object
      const newDay = new days(title, content);

      // Insert the newDay object into the database
      const result = await collection.insertOne(newDay);

      console.log('New day added:', result.insertedId);
      return result.insertedId; // Return the newly inserted document's _id
    } catch (err) {
      console.error('Error adding a new day:', err);
      throw err;
    }
  }
  static getAll(client) {
    try {
      const db = client.db('BlogWeb');
      const collection = db.collection('blog');
      return collection.find({}).toArray();
    } catch (err) {
      console.error('Error retrieving items:', err);
      throw err;
    }
  }
}
  

// Static array to store all the Days objects
     const first = new days('First post', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi enim sint vitae obcaecati vel laudantium quibusdam totam, libero voluptate sequi est hic quasi inventore esse! Earum quod laboriosam culpa consectetur.')
     const second =  new days('Second post', 'r, adipisicing elit. Animi enim sint vitae obcaecati vel laudantium quibusdam totam, libero voluptate sequi est hic quasi inventore esse! Earum quod laboriosam culpa consectetu')
     const third =  new days('Third post', 'This is r, adipisicing elit. Animi enim sint vitae obcaecati vel laudantium quibusdam totam, libero voluptate sequi est hic quasi inventore esse! Earum quod laboriosam culpa consectetuthe content of the third post.')

     async function checkIfEmpty(client) {
      try {
        const db = client.db('BlogWeb'); 
        const collection = db.collection('blog'); 
        const items = await collection.find({}).toArray();
        if (items.length === 0) {
          const defaultItems = [
            first,
            second,
            third
          ];
          await collection.insertMany(defaultItems);
          console.log('Default items saved');
        }
      } catch (err) {
        console.error('Error checking and inserting default items:', err);
      }
    }
    
 


  module.exports = days;
  module.exports.checkIfEmpty = checkIfEmpty
  