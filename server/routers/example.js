import mongoose from 'mongoose';
import express from 'express';

import config from '../config.json';

const exRouter = express.Router();

exRouter.get('/examples', (req, res) => {
  res.type('application/json');
  //Connect to database, get entity(s) and send 'em back to client.
});


exRouter.route('/example')
  .post(function(req, res) {
    // req.body will contain new 'example' entity.
  })


exRouter.route('/example/:exId') // req.params.exId
  .get(function(req,res) { // Read
    
  })
  .put(function(req, res) { // Update (full record overwrite)

  })
  .patch(function(req, res) { // Update (some fields)

  })
  .delete(function(req, res) { // Delete

  })

export { exRouter };