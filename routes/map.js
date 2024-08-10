
const express = require("express");
const router = express.Router();

router.get('/disasters', async (req, res) => {
    try {
        console.log("i am in the fetch part")
      const response = await axios.get('https://api.reliefweb.int/v1/disasters', {
        params: {
          limit: 10,
          sort: 'date:desc',
        },
      });
      res.json(response.data);
         
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
});
  

module.exports = router;