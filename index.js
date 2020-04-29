const axios = require('axios');
const moment = require('moment-timezone');
const FormData = require('form-data');
const fs = require('fs');

const dns = require('dns');
const http = require('http');
const https = require('https');
require('dotenv').config();

function non_base64_test() {
  axios.defaults.maxContentLength = Infinity;
  axios.defaults.maxBodyLength = Infinity;
  // axios.defaults.httpAgent = new http.Agent({ keepAlive: true });
  // axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

  const form = new FormData();
  const info = {
    veteranFirstName: 'FirstName',
    veteranLastName: 'LastName',
    fileNumber: '012345678',
    zipCode: '11111',
  };
  form.append('metadata', JSON.stringify(info), {
    contentType: 'application/json',
  });
  form.append('content', fs.createReadStream(process.env.UPLOAD_FILE_PATH), {
    filename: 'doc.pdf',
    contentType: 'application/pdf',
  });

  let config = {
    headers: {
      apikey: process.env.API_KEY,
      'Content-Type': 'multipart/form-data',
    },
  };

  let location = '';
  let guid = '';

  // Do a simple DNS resolution so we can figure out what address we're
  // likely utilizing
  dns.resolve4(new URL(process.env.URL).hostname, (err, addresses) => {
    if (err) throw err;
    console.log(`IP address of api: ${JSON.stringify(addresses)}`);
  });

  axios
    .post(`${process.env.URL}/services/vba_documents/v1/uploads`, null, config)
    .then(function (response) {
      guid = response.data.data.attributes.guid;
      location = response.data.data.attributes.location;
      timeET = moment().tz('America/New_York').format();
      console.log(`Time = ${timeET}`);
      console.log(`GUID = ${guid}\nUpload location = ${location}`);
      return axios.put(response.data.data.attributes.location, form, {});
    })
    .then(function (response) {
      console.log(`Response from PUT was: \n${response.data}`);
      return axios.get(
        `${process.env.URL}/services/vba_documents/v1/uploads/${guid}`,
        null,
        config
      );
    })
    .then(function (response) {
      let attributes = response.data.data.attributes;
      console.log(
        `Upload status after 10 seconds: \n${JSON.stringify(
          response.data.data.attributes
        )}`
      );
      return response.data.data.attributes.status;
    })
    .then(async function (status) {
      if (status === 'received') {
        return;
      }
      await sleep(10000);
      return axios.get(
        `${process.env.URL}/services/vba_documents/v1/uploads/${guid}`,
        config
      );
    })
    .then(function (response) {
      if (!response) {
        return 'received';
      }
      let attributes = response.data.data.attributes;
      console.log(
        `Upload status after 20 seconds: \n${JSON.stringify(
          response.data.data.attributes
        )}`
      );
      return response.data.data.attributes.status;
    })
    .then(async function (status) {
      if (status === 'received') {
        return;
      }
      await sleep(10000);
      return axios.get(
        `${process.env.URL}/services/vba_documents/v1/uploads/${guid}`,
        config
      );
    })
    .then(function (response) {
      if (!response) {
        return 'received';
      }
      let attributes = response.data.data.attributes;
      console.log(
        `Upload status after 30 seconds: \n${JSON.stringify(
          response.data.data.attributes
        )}`
      );
      return response.data.data.attributes.status;
    })
    // .then(function () {
    //   return axios.get(
    //     `${process.env.URL}/services/vba_documents/v1/uploads/${guid}/download`,
    //     config
    //   );
    // })
    .catch(function (error) {
      console.log(`Error detected - ${error}`);
    });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function base64_test() {
  axios.defaults.maxContentLength = Infinity;
  axios.defaults.maxBodyLength = Infinity;

  const buff = Buffer.from(
    fs.readFileSync(process.env.UPLOAD_FILE_PATH),
    'base64'
  );
  const form = new FormData();
  const info = {
    veteranFirstName: 'FirstName',
    veteranLastName: 'LastName',
    fileNumber: '012345678',
    zipCode: '11111',
  };
  form.append('metadata', JSON.stringify(info), {
    contentType: 'application/json',
  });
  form.append('content', buff, {
    filename: 'doc.pdf',
    contentType: 'application/pdf',
  });

  let config = {
    headers: {
      apikey: process.env.API_KEY,
      'Content-Type': 'multipart/form-data',
    },
  };

  let location = '';
  let guid = '';

  // Do a simple DNS resolution so we can figure out what address we're
  // likely utilizing
  dns.resolve4(new URL(process.env.URL).hostname, (err, addresses) => {
    if (err) throw err;
    console.log(`IP address of api: ${JSON.stringify(addresses)}`);
  });

  axios
    .post(`${process.env.URL}/services/vba_documents/v1/uploads`, null, config)
    .then(function (response) {
      guid = response.data.data.attributes.guid;
      location = response.data.data.attributes.location;
      timeET = moment().tz('America/New_York').format();
      console.log(`Time = ${timeET}`);
      console.log(`GUID = ${guid}\nUpload location = ${location}`);
      return axios.put(response.data.data.attributes.location, form, config);
    })
    .then(async function (response) {
      await sleep(10000);
      return axios.get(
        `${process.env.URL}/services/vba_documents/v1/uploads/${guid}`,
        config
      );
    })
    .then(function (response) {
      let attributes = response.data.data.attributes;
      console.log(
        `Upload status after 10 seconds: \n${JSON.stringify(
          response.data.data.attributes
        )}`
      );
      return response.data.data.attributes.status;
    })
    .then(async function (status) {
      if (status === 'received') {
        return;
      }
      await sleep(10000);
      return axios.get(
        `${process.env.URL}/services/vba_documents/v1/uploads/${guid}`,
        config
      );
    })
    .then(function (response) {
      if (!response) {
        return 'received';
      }
      let attributes = response.data.data.attributes;
      console.log(
        `Upload status after 20 seconds: \n${JSON.stringify(
          response.data.data.attributes
        )}`
      );
      return response.data.data.attributes.status;
    })
    .then(async function (status) {
      if (status === 'received') {
        return;
      }
      await sleep(10000);
      return axios.get(
        `${process.env.URL}/services/vba_documents/v1/uploads/${guid}`,
        config
      );
    })
    .then(function (response) {
      if (!response) {
        return 'received';
      }
      let attributes = response.data.data.attributes;
      console.log(
        `Upload status after 30 seconds: \n${JSON.stringify(
          response.data.data.attributes
        )}`
      );
      return response.data.data.attributes.status;
    })
    // .then(function () {
    //   return axios.get(
    //     `${process.env.URL}/services/vba_documents/v1/uploads/${guid}/download`,
    //     config
    //   );
    // })
    .catch(function (error) {
      console.log(`Error detected - ${error}`);
    });
}

/*
Do some simple testing between non_base64 version vs base64 version.
*/

// non_base64_test();
base64_test();
