const csv = require('csv-parser');
const fs = require('fs');
const {
    plot,
    Plot
} = require('nodeplotlib');

let data = {
    abby: {
        textCount: 0
    },
    andrew: {
        textCount: 0
    },
    heartCount: 0
};

let dateData = {}


fs.createReadStream(__dirname + '/csv/8-23-2021.csv')
    .pipe(csv())
    .on('data', (entry) => {
        let sender = entry["Sender Name"];
        let date = new Date(entry["Message Date"]);
        let month = date.getMonth() + 1; //months from 1-12
        let day = date.getDate();
        let year = date.getFullYear();
        let msgDate = month + "/" + day + "/" + year;

        let text = entry.Text;

        if (!sender) {
            sender = 'Andrew';
        }

        if (sender === 'Abby 👩🏻‍🌾') {
            data.abby.textCount += 1;
        } else {
            data.andrew.textCount += 1;
        }

        if (text === '') {
            text = entry.Attachment;
        }
        if (text.includes('💜') || text.includes('💚')) {
            data.heartCount += 1;
        }
        if (!dateData[msgDate]) {
            dateData[msgDate] = []
        }
        dateData[msgDate].push(entry);

        // fs.appendFile('text.log', `${sender}: ${text}\n`, err => {})
    })
    .on('end', () => {
        console.log(data);
        let x = []
        let y = []
        for (const entry in dateData) {
            x.push(entry)
            y.push(dateData[entry].length)
        }
        const trace = {
            x: x,
            y: y,
            type: 'bar'
        };
        plot([trace]);
        // console.log(dateData["10/10/2020"])
    });