const http = require('http');
const fs = require('fs');
const url = require('url');



// function to replace template strings with product data
const replaceTemplate = (temp, product) => {
    // replace template strings with product data
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%DESCREPTION%}/g, product.description);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    return output;
}

// template pages
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// data file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    const {query, pathname } = url.parse(req.url, true);

    // overview page
    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200, {'content-type': 'text/html'});
        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)
        res.end(output)

        // product page
    } else if(pathname === "/product"){
        res.writeHead(200, {'content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // page not found
    } else{
        res.end('Page Not Found');
    }
});

server.listen(4000, ()=>{
    console.log("server runing port 4000")
})