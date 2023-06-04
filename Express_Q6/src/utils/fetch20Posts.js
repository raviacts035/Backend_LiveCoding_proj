// Fetches 20,posts from 

const fetch20Posts=async ()=>{
    let blogsList= await fetch("https://jsonplaceholder.typicode.com/posts");
    let jList= await blogsList.json();
    return jList.slice(0,20)
}

export default fetch20Posts