const fs = require("fs");

const writer = async (file, data) =>{
    const outputFolder = './tmp'

    if(!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder)
    }

    return new Promise((resolve, reject) =>  fs.writeFile(`${outputFolder}/${file}`, data, (error, data) => {
        if(error) return reject(error); 
        return resolve(data);
    }))
}

module.exports = writer;