const fs = require("fs");

const writer = async (file, data) =>{
    const resultFolder = 'tmp'
    return new Promise((resolve, reject) =>   fs.writeFile(`${resultFolder}/${file}`, data, (error, data) => {
        if(error) return reject(error); 
        return resolve(data);
    }))
}

module.exports = writer;