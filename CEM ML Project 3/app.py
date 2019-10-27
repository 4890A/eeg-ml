import os

import pandas as pd
import numpy as np
import random

import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
import sys

from sklearn.externals.joblib import dump, load
from keras.utils import to_categorical
from keras.models import load_model

from tinydb import TinyDB, Query

app = Flask(__name__)

#################################################
# Database Setup
#################################################

#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/bellybutton.sqlite"

#************************* CONNECTING TO LOCAL DB *******************************************
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/project3db.sqlite"

#******************* KENT ****************************
# user_and_pw = "user1:password"

# engine_string = "postgresql://" + user_and_pw + "@proj3-database.c733pkfot2yr.us-east-2.rds.amazonaws.com:5432/data_db"

# This might enable more SqlAlchemy functionality to be used
# SQLALCHEMY_DATABASE_URI = "postgresql://" + user_and_pw + "@proj3-database.c733pkfot2yr.us-east-2.rds.amazonaws.com:5432/data_db"

# app.config["SQLALCHEMY_DATABASE_URI"] = engine_string
#***************** KENT ***********************

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table for Brain Alcoholic Data
Alc_test = Base.classes.Alc_test1
#Alc_train = Base.classes.Alc_train1

#Tables for Human Activity Data - Phone
HA_test_phone = Base.classes.HA_test_phone1
#HA_train_phone1 = Base.classes.HA_train_phone1

#Tables for Human Activity Data - Watch
HA_test_watch = Base.classes.HA_test_watch1
#HA_train_watch = Base.classes.HA_train_watch1

#************************ TABLES FROM KENT DATABASE *********************************
#Alc_test = Base.classes.Alc_test1
#HA_test_phone = Base.classes.HA_test_phone1
#HA_test_watch = Base.classes.HA_test_watch1
#***********************************************************************************


data = {}    #empty dict to store data from Javascript

@app.route("/")
def index():
    """Return the homepage."""
    # return render_template("index1.html")
    return render_template("index.html")
 

#Route to present World Heat Map where tweets occurred is rendered
@app.route("/braina")
def braina():
    """Return a list of test HA data for phone"""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Alc_test).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    #Get X and y Test data

    y_test = df["Status"]
    X_test = df.iloc[:,1:65]

    #Place for directory of models
    directory = "models/"

    #***************** FIRST MODEL *************************************

    #Load the Scaled function for model
    filesc = directory + "AB_LR_scaler.bin"
    X_scaler = load(filesc)

    #Scales X_test data
    X_test_scaled = X_scaler.transform(X_test)

    #Load Label Encoder and encodes data
    filenc = directory+"AB_NN_label_encoder.bin"
    label_encoder = load(filenc)
    
    #Create y_test_categorical
    encoded_y_test = label_encoder.transform(y_test)
    y_test_categorical = to_categorical(encoded_y_test)
    
    #Import a model (NN)
    from keras.models import load_model
    modeln1 = directory+"AB_NN.h5"
    model = load_model(modeln1)

    #Evaluate accuracy of model with test data
    model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)

    n = random.randint(0,1000)

    encoded_prediction = model.predict_classes(X_test_scaled[n-1:n])
    prediction_label = label_encoder.inverse_transform(encoded_prediction)

    NNdata = {"model_loss" : model_loss,
                 "model_accuracy" : model_accuracy,
                 "prediction" : list(prediction_label)
                 }
    
    #***************** SECOND MODEL *************************************

    #Import a model (1DCNN MODEL)
    modeln1 = directory+"AB_1DCNN.h5"
    model = load_model(modeln1)

    #Evaluate accuracy of model with test data
    model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)

    encoded_prediction = model.predict_classes(X_test_scaled[n-1:n])
    prediction_label = label_encoder.inverse_transform(encoded_prediction)
    
    DCNNdata = {"model_loss" : model_loss,
                "model_accuracy" : model_accuracy,
                "prediction" : list(prediction_label)
                }
                
    #***************** THIRD MODEL *************************************

    #Importing LOgaritmic Regression Model
    import pickle
    filename = directory+"AB_LR.sav"
    model = pickle.load(open(filename, 'rb'))

    y1 = y_test
    y2 = []
    for s in y1:
        if 'alcoholic' in s:
            y2.append(1)
        else:
            y2.append(0)
            
    y4 = pd.DataFrame({"label":y2})
    y_testLR = y4["label"]

    model_accuracy = model.score(X_test_scaled, y_testLR)

    prediction = model.predict(X_test_scaled[n-1:n])

    if list(prediction) == 1:
        plr = ["alcoholic"]
    else:
        plr = ["control"]

    LRdata = {"model_loss" : "NA",
                 "model_accuracy" : model_accuracy,
                 "prediction" : plr
            }

    datam = {"subject_data": list(X_test.iloc[n-1:n,:].values[0]),
             "real_output" : list(y_test[n-1:n]),
             "NN" : NNdata,
             "DCNN" : DCNNdata,
             "LR" : LRdata
             }

    # Return a dictionary with tweets location and sentiment
    return jsonify(datam)

@app.route("/haphone")
def haphone():

    """Return a list of test HA data for phone"""

    # Use Pandas to perform the sql query
    stmt = db.session.query(HA_test_phone).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    #Get X and y Test data

    y_test = df["Status"]
    X_test = df.iloc[:,1:4]

    #Place for directory of models
    directory = "models/"

    #***************** FIRST MODEL *************************************
    
    #Load the Scaled function for model
    filesc = directory + "HAPNN_scaler.bin"
    X_scaler = load(filesc)

    #Scales X_test data
    X_test_scaled = X_scaler.transform(X_test)

    #Load Label Encoder and encodes data
    filenc = directory+"HAPNN_label_encoder.bin"
    label_encoder = load(filenc)
    
    #Create y_test_categorical
    encoded_y_test = label_encoder.transform(y_test)
    y_test_categorical = to_categorical(encoded_y_test)
    
    #Import a model (NN)
    from keras.models import load_model
    modeln1 = directory+"HAP_NN_model.h5"
    model = load_model(modeln1)

    #Evaluate accuracy of model with test data
    model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)

    n = random.randint(0,1000)

    encoded_prediction = model.predict_classes(X_test_scaled[n-1:n])
    prediction_label = label_encoder.inverse_transform(encoded_prediction)

    NNdata = {"model_loss" : model_loss,
                 "model_accuracy" : model_accuracy,
                 "prediction" : list(prediction_label)
                 }

    #****************** SECOND MODEL **************************************

    #Load the Scaled function for model
    filesc = directory + "HAPRNN_scaler.bin"
    X_scaler = load(filesc)

    #Scales X_test data
    X_test_scaled = X_scaler.transform(X_test)

    #Load Label Encoder and encodes data
    filenc = directory+"HAP_RNNlabel_encoder.bin"
    label_encoder = load(filenc)
    
    #Create y_test_categorical
    encoded_y_test = label_encoder.transform(y_test)
    y_test_categorical = to_categorical(encoded_y_test)
    
    #Import a model (NN)
    from keras.models import load_model
    modeln1 = directory+"HAP_RNN.h5"
    model = load_model(modeln1)

    X_test_scaled = np.reshape(X_test_scaled, (X_test_scaled.shape[0],1,X_test_scaled.shape[1]))
    X_test_scaled = np.array(X_test_scaled)

    model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)

    encoded_predictions = model.predict_classes(X_test_scaled[n-1:n])
    prediction_labels = label_encoder.inverse_transform(encoded_predictions)

    RNNdata = {"model_loss" : model_loss,
                "model_accuracy" : model_accuracy,
                "prediction" : list(prediction_labels)
                }


    datam = {"subject_data": list(X_test.iloc[n-1:n,:].values[0]),
             "real_output" : list(y_test[n-1:n]),
             "NN" : NNdata,
             "RNN" : RNNdata
             }

    # Return a dictionary with tweets location and sentiment
    return jsonify(datam)
    #return "HELLO"


@app.route("/hawatch")
def hawatch():

    """Return a list of test HA data for watch"""

    # Use Pandas to perform the sql query
    stmt = db.session.query(HA_test_watch).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    #Get X and y Test data

    y_test = df["Status"]
    X_test = df.iloc[:,1:4]

    #Place for directory of models
    directory = "models/"

    #***************** FIRST MODEL *************************************
    
    #Load the Scaled function for model
    filesc = directory + "HAWNN_scaler.bin"
    X_scaler = load(filesc)

    #Scales X_test data
    X_test_scaled = X_scaler.transform(X_test)

    #Load Label Encoder and encodes data
    filenc = directory+"HAWNN_label_encoder.bin"
    label_encoder = load(filenc)
    
    #Create y_test_categorical
    encoded_y_test = label_encoder.transform(y_test)
    y_test_categorical = to_categorical(encoded_y_test)
    
    #Import a model (NN)
    from keras.models import load_model
    modeln1 = directory+"HAW_NN_model.h5"
    model = load_model(modeln1)

    #Evaluate accuracy of model with test data
    model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)

    n = random.randint(0,1000)

    encoded_prediction = model.predict_classes(X_test_scaled[n-1:n])
    prediction_label = label_encoder.inverse_transform(encoded_prediction)

    NNdata = {"model_loss" : model_loss,
                 "model_accuracy" : model_accuracy,
                 "prediction" : list(prediction_label)
                 }

    #****************** SECOND MODEL **************************************

    #Load the Scaled function for model
    filesc = directory + "HAW_RNNscaler.bin"
    X_scaler = load(filesc)

    #Scales X_test data
    X_test_scaled = X_scaler.transform(X_test)

    #Load Label Encoder and encodes data
    filenc = directory+"HAW_RNNlabel_encoder.bin"
    label_encoder = load(filenc)
    
    #Create y_test_categorical
    encoded_y_test = label_encoder.transform(y_test)
    y_test_categorical = to_categorical(encoded_y_test)
    
    #Import a model (NN)
    from keras.models import load_model
    modeln1 = directory+"HAW_RNN.h5"
    model = load_model(modeln1)

    X_test_scaled = np.reshape(X_test_scaled, (X_test_scaled.shape[0],1,X_test_scaled.shape[1]))
    X_test_scaled = np.array(X_test_scaled)

    model_loss, model_accuracy = model.evaluate(X_test_scaled, y_test_categorical, verbose=2)

    encoded_predictions = model.predict_classes(X_test_scaled[n-1:n])
    prediction_labels = label_encoder.inverse_transform(encoded_predictions)

    RNNdata = {"model_loss" : model_loss,
                "model_accuracy" : model_accuracy,
                "prediction" : list(prediction_labels)
                }


    datam = {"subject_data": list(X_test.iloc[n-1:n,:].values[0]),
             "real_output" : list(y_test[n-1:n]),
             "NN" : NNdata,
             "RNN" : RNNdata
             }

    # Return a dictionary with tweets location and sentiment
    return jsonify(datam)


if __name__ == "__main__":
    app.run()
