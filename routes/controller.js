const mongoose = require('mongoose');
const urls = require('../model/url');
const UrlCode = mongoose.model('UrlCode', urls.urlSchema);
//load input form for creating short url
exports.loadForm = (req, res) => {
  return res.render('form');
};

//get url from req body and check if it already exists in database
//if it already exists return it plus short url code
//if it doesn't generate new short url code and save to database
exports.setURL = async (req, res) => {
  const url = req.body.url;
  console.log(`url:  ${url}`);

  //addtional validation check
  httpCheck = /^https?:\/\//;
  if (!httpCheck.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  //checking to see if url is ready in databse
  const urlCode = await UrlCode.findOne({ url });
  if (!urlCode) {
    //new url , add to database
    //1 must find number for short url, will just do +1 of index size
    //checking if there are eny entries
    let indexurl = 0;
    const exists = await UrlCode.exists();
    if (exists) {
      indexurl = await UrlCode.countDocuments();
      indexurl++;
    } else indexurl = 1; //first index
    indexurl = parseInt(indexurl);
    console.log(`index: ${indexurl}, url: ${url}`);
    //creating new entry
    const newUrl = await new UrlCode({ indexurl: indexurl, url: url });
    console.log(`index: ${newUrl.indexurl}, url: ${newUrl.url}`);
    await newUrl.save();
    return res.json({ original_url: newUrl.url, short_url: newUrl.indexurl });
  } else {
    //url already exists is database, return existing info
    return res.json({
      original_url: urlCode.url,
      short_url: urlCode.indexurl,
    });
  }
};

//if short url provided exists, redirect site or corresponding url
//that is saved in database
exports.redirect = async (req, res) => {
  //extracting short url code from params
  const shortcode = parseInt(req.params.thecode);
  console.log(`req.params: ${JSON.stringify(req.params)}`);
  //checking input
  if (typeof shortcode != 'number')
    return res.send('Sorry, you inputed invalid short url, please try again!');

  console.log(`shortcode: ${shortcode}`);
  //checking if see if this code exists in directory
  const urlCode = await UrlCode.findOne({ indexurl: shortcode });

  if (!urlCode) {
    //if code doesn't exist return error message
    return res.send(
      'Sorry, this short url code does not exist, please try again!'
    );
  } else {
    //if exists, redirect to corresponding original url, we're done!
    console.log(`destination: ${urlCode.url}`);
    return res.redirect(301, urlCode.url);
  }
};
