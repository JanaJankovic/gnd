from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
import os
import pymongo
from bson.objectid import ObjectId
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


clientdb = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = clientdb.guess_and_dress

user_collection = db.user
item_collection = db.item
outfit_collection = db.outfit
evaluation_collection = db.evaluation

prediction_collection = db.prediction
prediction_collection.create_index([('date', 1), ('location', 1)], unique=True)

seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
categories = ['Upper body', 'Lower body', 'Footwear', 'Jacket', 'Accessories']


@app.route('/test', methods=['GET'])
@cross_origin()
def test():
    return {'test': 'Connection works'}


# ------------------USER------------------
@app.route('/user/register', methods=['POST'])
@cross_origin()
def register():
    result = user_collection.insert_one(request.json)
    return {'acknowledged': result.acknowledged, '_id': str(result.inserted_id)}


@app.route('/user/login', methods=['POST'])
@cross_origin()
def login():
    user = request.json
    result = user_collection.find_one(user)
    if result is not None:
        data = {
            '_id': str(result['_id']),
            'fullname': result['fullname'],
            'email': result['email'],
            'password': result['password'],
            'image': result['image'] if 'image' in result else None,
        }
        return data
    return {'error': 'Not found'}


@app.route('/user/update', methods=['PUT'])
@cross_origin()
def user_update():
    user = request.json
    _id = user.pop('_id', None)
    if _id is not None:
        result = user_collection.find_one_and_update(
            {'_id': ObjectId(_id)}, {'$set': user})
        return {'acknowledged': True, '_id': _id}

    return {'error': 'No id given'}


@app.route('/user/delete', methods=['DELETE'])
@cross_origin()
def user_delete():
    _id = request.json.pop('_id', None)
    if _id is not None:
        result = user_collection.find_one_and_delete({'_id': ObjectId(_id)})
        return {'acknowledged': True, '_id': _id}
    return {'error': 'No id given'}

# ------------------ITEM------------------


@app.route('/item/create', methods=['POST'])
@cross_origin()
def item_create():
    data = request.json
    data['user_id'] = ObjectId(data['user_id'])
    result = item_collection.insert_one(data)
    return {'acknowledged': result.acknowledged, '_id': str(result.inserted_id)}


@app.route('/item/get', methods=['POST'])
@cross_origin()
def item_get():
    data = request.json

    if 'user_id' not in data and 'category' not in data:
        return {'error': 'Id not given'}

    query = {
        'user_id': ObjectId(data['user_id']),
        'category': categories[data['category']]
    }

    if 'subcategory' in data and data['subcategory'] == 4:
        query['subcategory'] = 'Umbrella'

    if 'subcategory' in data and data['subcategory'] == 5:
        query['$or'] = [
            {'subcategory': 'Sunglasses'},
            {'subcategory': 'Gloves'},
        ]

    if 'subcategory' in data and data['subcategory'] == 6:
        query['$or'] = [
            {'subcategory': 'Cap'},
            {'subcategory': 'Hat'},
        ]

    items = item_collection.find(query)

    data = []
    for item in items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        data.append(item)

    return data


@app.route('/item/get/similar', methods=['POST'])
@cross_origin()
def get_similar_items():
    data = request.json
    data['user_id'] = ObjectId(data['user_id'])

    ranges = get_interval_range(data)

    query = {
        'user_id': data['user_id'],
        'category': data['category'],
        'warmth': {
            '$gte': ranges[0]['start_value'],
            '$lte': ranges[0]['end_value']
        },
        'waterproof': {
            '$gte': ranges[1]['start_value'],
            '$lte': ranges[1]['end_value']
        },
        'windproof': {
            '$gte': ranges[2]['start_value'],
            '$lte': ranges[2]['end_value']
        }

    }

    if 'subcategory' in data:
        query['subcategory'] = data['subcategory']

    items = item_collection.find(query)

    data = []
    for item in items:
        item['_id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])
        data.append(item)

    return data


@app.route('/item/update', methods=['PUT'])
@cross_origin()
def item_update():
    item = request.json
    _id = item.pop('_id', None)
    item['user_id'] = ObjectId(item['user_id'])
    if _id is not None:
        result = item_collection.find_one_and_update(
            {'_id': ObjectId(_id)}, {'$set': item})
        return {'acknowledged': True, '_id': _id}
    return {'error': 'No id given'}


@app.route('/item/delete', methods=['DELETE'])
@cross_origin()
def item_delete():
    _id = request.json.pop('_id', None)
    if _id is not None:
        result = item_collection.find_one_and_delete({'_id': ObjectId(_id)})
        return {'acknowledged': True, '_id': _id}
    return {'error': 'No id given'}


# ------------------OUTFIT------------------

@app.route('/outfit/create', methods=['POST'])
@cross_origin()
def outfit_create():
    outfit = request.json
    if 'user_id' in outfit:
        outfit['user_id'] = ObjectId(outfit['user_id'])

    if 'upper_id' in outfit:
        outfit['upper_id'] = ObjectId(outfit['upper_id'])

    if 'lower_id' in outfit:
        outfit['lower_id'] = ObjectId(outfit['lower_id'])

    if 'jacket_id' in outfit:
        outfit['jacket_id'] = ObjectId(outfit['jacket_id'])

    if 'foot_id' in outfit:
        outfit['foot_id'] = ObjectId(outfit['foot_id'])

    if 'gloves_sunglasses_id' in outfit:
        outfit['gloves_sunglasses_id'] = ObjectId(
            outfit['gloves_sunglasses_id'])

    if 'cap_hat_id' in outfit:
        outfit['cap_hat_id'] = ObjectId(outfit['cap_hat_id'])

    if 'umbrella_id' in outfit:
        outfit['umbrella_id'] = ObjectId(outfit['umbrella_id'])

    result = outfit_collection.insert_one(outfit)
    return {'acknowledged': result.acknowledged, '_id': str(result.inserted_id)}


@app.route('/outfit/get/multiple/<int:season>/<user_id>', methods=['GET'])
@cross_origin()
def outfit_get(season, user_id):
    pipeline = [
        {
            '$match': {
                'user_id': ObjectId(user_id),
                'season': seasons[season]
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'upper_id',
                'foreignField': '_id',
                'as': 'upper'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'lower_id',
                'foreignField': '_id',
                'as': 'lower'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'jacket_id',
                'foreignField': '_id',
                'as': 'jacket'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'foot_id',
                'foreignField': '_id',
                'as': 'foot'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'gloves_sunglasses_id',
                'foreignField': '_id',
                'as': 'gloves_sunglasses'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'cap_hat_id',
                'foreignField': '_id',
                'as': 'cap_hat'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'umbrella_id',
                'foreignField': '_id',
                'as': 'umbrella'
            }
        },
        {
            '$project': {
                '_id': 1,
                'season': 1,
                'user_id': 1,
                'upper': {'$arrayElemAt': ['$upper', 0]},
                'lower': {'$arrayElemAt': ['$lower', 0]},
                'jacket': {'$arrayElemAt': ['$jacket', 0]},
                'foot': {'$arrayElemAt': ['$foot', 0]},
                'gloves_sunglasses': {'$arrayElemAt': ['$gloves_sunglasses', 0]},
                'cap_hat': {'$arrayElemAt': ['$cap_hat', 0]},
                'umbrella': {'$arrayElemAt': ['$umbrella', 0]},
            }
        }
    ]
    result = db.outfit.aggregate(pipeline)

    data = []
    for document in result:
        document['_id'] = str(document['_id'])
        document['user_id'] = str(document['user_id'])

        if 'upper' in document:
            document['upper']['_id'] = str(document['upper']['_id'])
            document['upper']['user_id'] = str(document['upper']['user_id'])

        if 'lower' in document:
            document['lower']['_id'] = str(document['lower']['_id'])
            document['lower']['user_id'] = str(document['lower']['user_id'])

        if 'jacket' in document:
            document['jacket']['_id'] = str(document['jacket']['_id'])
            document['jacket']['user_id'] = str(document['jacket']['user_id'])

        if 'foot' in document:
            document['foot']['_id'] = str(document['foot']['_id'])
            document['foot']['user_id'] = str(document['foot']['user_id'])

        if 'gloves_sunglasses' in document:
            document['gloves_sunglasses']['_id'] = str(
                document['gloves_sunglasses']['_id'])
            document['gloves_sunglasses']['user_id'] = str(
                document['gloves_sunglasses']['user_id'])

        if 'cap_hat' in document:
            document['cap_hat']['_id'] = str(document['cap_hat']['_id'])
            document['cap_hat']['user_id'] = str(
                document['cap_hat']['user_id'])

        if 'umbrella' in document:
            document['umbrella']['_id'] = str(document['umbrella']['_id'])
            document['umbrella']['user_id'] = str(
                document['umbrella']['user_id'])
        data.append(document)
    return data


@app.route('/outfit/get/single/<_id>', methods=['GET'])
@cross_origin()
def outfit_get_by_id(_id):
    pipeline = [
        {
            '$match': {
                '_id': ObjectId(_id),
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'upper_id',
                'foreignField': '_id',
                'as': 'upper'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'lower_id',
                'foreignField': '_id',
                'as': 'lower'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'jacket_id',
                'foreignField': '_id',
                'as': 'jacket'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'foot_id',
                'foreignField': '_id',
                'as': 'foot'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'gloves_sunglasses_id',
                'foreignField': '_id',
                'as': 'gloves_sunglasses'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'cap_hat_id',
                'foreignField': '_id',
                'as': 'cap_hat'
            }
        },
        {
            '$lookup': {
                'from': 'item',
                'localField': 'umbrella_id',
                'foreignField': '_id',
                'as': 'umbrella'
            }
        },
        {
            '$project': {
                '_id': 1,
                'season': 1,
                'user_id': 1,
                'upper': {'$arrayElemAt': ['$upper', 0]},
                'lower': {'$arrayElemAt': ['$lower', 0]},
                'jacket': {'$arrayElemAt': ['$jacket', 0]},
                'foot': {'$arrayElemAt': ['$foot', 0]},
                'gloves_sunglasses': {'$arrayElemAt': ['$gloves_sunglasses', 0]},
                'cap_hat': {'$arrayElemAt': ['$cap_hat', 0]},
                'umbrella': {'$arrayElemAt': ['$umbrella', 0]},
            }
        }
    ]
    result = db.outfit.aggregate(pipeline)

    data = []
    for document in result:
        document['_id'] = str(document['_id'])
        document['user_id'] = str(document['user_id'])

        if 'upper' in document:
            document['upper']['_id'] = str(document['upper']['_id'])
            document['upper']['user_id'] = str(document['upper']['user_id'])

        if 'lower' in document:
            document['lower']['_id'] = str(document['lower']['_id'])
            document['lower']['user_id'] = str(document['lower']['user_id'])

        if 'jacket' in document:
            document['jacket']['_id'] = str(document['jacket']['_id'])
            document['jacket']['user_id'] = str(document['jacket']['user_id'])

        if 'foot' in document:
            document['foot']['_id'] = str(document['foot']['_id'])
            document['foot']['user_id'] = str(document['foot']['user_id'])

        if 'gloves_sunglasses' in document:
            document['gloves_sunglasses']['_id'] = str(
                document['gloves_sunglasses']['_id'])
            document['gloves_sunglasses']['user_id'] = str(
                document['gloves_sunglasses']['user_id'])

        if 'cap_hat' in document:
            document['cap_hat']['_id'] = str(document['cap_hat']['_id'])
            document['cap_hat']['user_id'] = str(
                document['cap_hat']['user_id'])

        if 'umbrella' in document:
            document['umbrella']['_id'] = str(document['umbrella']['_id'])
            document['umbrella']['user_id'] = str(
                document['umbrella']['user_id'])
        data.append(document)

    if len(data) > 0:
        return data[0]

    return {'error': 'Not found'}


@app.route('/outfit/update', methods=['PUT'])
@cross_origin()
def outfit_update():
    outfit = request.json
    _id = outfit.pop('_id', None)

    if 'user_id' in outfit:
        outfit['user_id'] = ObjectId(outfit['user_id'])

    if 'upper_id' in outfit:
        outfit['upper_id'] = ObjectId(outfit['upper_id'])

    if 'lower_id' in outfit:
        outfit['lower_id'] = ObjectId(outfit['lower_id'])

    if 'jacket_id' in outfit:
        outfit['jacket_id'] = ObjectId(outfit['jacket_id'])

    if 'foot_id' in outfit:
        outfit['foot_id'] = ObjectId(outfit['foot_id'])

    if 'gloves_sunglasses_id' in outfit:
        outfit['gloves_sunglasses_id'] = ObjectId(
            outfit['gloves_sunglasses_id'])

    if 'cap_hat_id' in outfit:
        outfit['cap_hat_id'] = ObjectId(outfit['cap_hat_id'])

    if 'umbrella_id' in outfit:
        outfit['umbrella_id'] = ObjectId(outfit['umbrella_id'])

    if _id is not None:
        result = outfit_collection.find_one_and_update(
            {'_id': ObjectId(_id)}, {'$set': outfit})
        return {'acknowledged': True, '_id': _id}

    return {'error': 'No id given'}


@app.route('/outfit/delete', methods=['DELETE'])
@cross_origin()
def outfit_delete():
    _id = request.json.pop('_id', None)
    if _id is not None:
        result = outfit_collection.find_one_and_delete({'_id': ObjectId(_id)})
        return {'acknowledged': True, '_id': _id}
    return {'error': 'No id given'}


# ------------------WEATHER API------------------

@app.route('/weather/forecast/<location>', methods=['GET'])
@cross_origin()
def weather_icons(location):
    return get_prediction_api(location, 3)


@app.route('/weather/suggestions', methods=['POST'])
@cross_origin()
def get_suggestions():
    data = request.json

    if 'user_id' not in data:
        return {'error': 'No id given'}

    if 'location' not in data:
        return {'error': 'No location given'}

    user_id = data['user_id']
    location = data['location']
    current_date = datetime.now()
    season_number = get_season_number(current_date)

    prediction = get_prediction_api(location, 5)

    outfits = []
    for p in prediction['forecast']:
        t = p['temp']
        wc = p['icon']
        prec = p['prec']
        w = p['wind']
        gl_sun = get_gloves_sunglasses(user_id, t, wc)
        cap_hat = get_hat_cap(user_id, t, wc)
        upper = get_upper(user_id, t)
        lower = get_lower(user_id, t)
        jacket = get_jacket(user_id, t, w, prec,)
        foot = get_foot(user_id, t, prec)
        umbrella = get_umbrella(user_id, prec, wc)

        outfit = {
            'season': seasons[season_number],
            'cap_hat': cap_hat,
            'foot': foot,
            'gloves_sunglasses': gl_sun,
            'upper': upper,
            'lower': lower,
            'jacket': jacket,
            'umbrella': umbrella
        }

        outfits.append(outfit)

    prediction['outfits'] = outfits
    return prediction


# ------------------EVALUATION API------------------

@app.route('/evaluation', methods=['GET'])
@cross_origin()
def evaluation():
    result = evaluation_collection.find()
    data = []
    if result is not None:
        for r in result:
            d = {
                'feature': r['feature'],
                'MAE': r['MAE'],
                'MSE': r['MSE'],
                'EVS': r['EVS'],
                'date': r['date']
            }
            data.append(d)
        return data
    return {'error': 'Not found'}


def get_prediction_api(location, days):
    lat = '46.5547222'
    lon = '15.6466667'

    if location == 'Ljubljana':
        lat = '46.05108'
        lon = '14.50513'
    if location == 'Bled':
        lat = '46.36917'
        lon = '14.11361'
    if location == 'Koper':
        lat = '45.54694'
        lon = '13.72944'
    if location == 'Celje':
        lat = '46.23092'
        lon = '15.26044'

    url_params = 'daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max'
    url = f'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&{url_params}&timezone=Europe%2FBerlin'
    raw = requests.get(url)
    raw = raw.json()

    df = pd.DataFrame()

    df['temp_max'] = raw['daily']['temperature_2m_max']
    df['temp_min'] = raw['daily']['temperature_2m_min']
    df['prec'] = raw['daily']['precipitation_sum']
    df['wind'] = raw['daily']['windspeed_10m_max']
    date = raw['daily']['time']
    icons = raw['daily']['weathercode']

    forecast = []
    for i in range(days):
        date_obj = datetime.strptime(date[i], "%Y-%m-%d")
        title = date_obj.strftime("%A")
        element = {
            'date': date[i],
            'title': title,
            'icon': icons[i],
            'temp': (df['temp_max'][i] + df['temp_min'][i])/2,
            'prec': df['prec'][i],
            'wind': df['wind'][i],
        }
        forecast.append(element)

    json_data = dict()
    json_data['forecast'] = forecast
    json_data['clothesIcons'] = get_suggestion_icons(forecast[0])

    return json_data


def get_suggestion_icons(df):

    clothes = []

    if df['prec'] > 0.5:
        clothes.append({'icon': 'umbrella', 'tooltip': 'Wet clothes suck.'})
    if df['temp'] < 10:
        clothes.append(
            {'icon': 'gloves', 'tooltip': 'No freezing hands today!'})
    if df['temp'] > 20 and df['icon'] < 3:
        clothes.append({
            'icon': 'cap',
            'tooltip': 'Dont let the heat get into your head!',
        })
        clothes.append(
            {'icon': 'sunglasses', 'tooltip': 'It will be sunny today!'})
    if df['temp'] < 10 or df['wind'] > 20:
        clothes.append({
            'icon': 'hat',
            'tooltip': 'Dont let the cold get into your head!',
        })
    return clothes


def get_interval_range(item):

    ranges = [
        {
            'start_value': 0,
            'end_value': 100,
        },
        {
            'start_value': 0,
            'end_value': 100,
        },
        {
            'start_value': 0,
            'end_value': 100,
        }
    ]

    values = [item['warmth'], item['waterproof'], item['windproof']]

    for i in range(0, 3):
        interval_size = 100 / 3
        interval = int((values[i] - 1) // interval_size) + 1

        if interval == 0 or interval == 1:
            ranges[i]['start_value'] = 0
            ranges[i]['end_value'] = 33

        if interval == 2:
            ranges[i]['start_value'] = 34
            ranges[i]['end_value'] = 66

        if interval == 3:
            ranges[i]['start_value'] = 66
            ranges[i]['end_value'] = 100

    return ranges


def get_gloves_sunglasses(user_id, t, wc):
    document = None
    query = {'user_id': ObjectId(user_id), 'category': 'Accessories'}

    if t < 10:
        query['subcategory'] = 'Gloves'
    if t > 19 and wc < 3:
        query['subcategory'] = 'Sunglasses'

    if 'subcategory' in query:

        pipeline = [
            {'$match': query},
            {'$sample': {'size': 1}}
        ]

        document = None
        result = list(item_collection.aggregate(pipeline))

        if result:
            document = result[0]

        if document is not None and '_id' in document:
            document['_id'] = str(document['_id'])

        if document is not None and 'user_id' in document:
            document['user_id'] = str(document['user_id'])

        return document

    return None


def get_hat_cap(user_id, t, wc):
    document = None
    query = {'user_id': ObjectId(user_id), 'category': 'Accessories'}

    if t < 10:
        query['subcategory'] = 'Hat'
    if t > 19 and wc < 3:
        query['subcategory'] = 'Cap'

    if 'subcategory' in query:
        pipeline = [
            {'$match': query},
            {'$sample': {'size': 1}}
        ]

        document = None
        result = list(item_collection.aggregate(pipeline))

        if result:
            document = result[0]

        if document is not None and '_id' in document:
            document['_id'] = str(document['_id'])

        if document is not None and 'user_id' in document:
            document['user_id'] = str(document['user_id'])

        return document
    return None


def get_umbrella(user_id, prec, wc):
    document = None
    query = {'user_id': ObjectId(user_id), 'category': 'Accessories'}

    if prec > 2.5 and wc > 53:
        query['subcategory'] = 'Umbrella'

    if 'subcategory' in query:

        pipeline = [
            {'$match': query},
            {'$sample': {'size': 1}}
        ]

        document = None
        result = list(item_collection.aggregate(pipeline))

        if result:
            document = result[0]

        if document is not None and '_id' in document:
            document['_id'] = str(document['_id'])

        if document is not None and 'user_id' in document:
            document['user_id'] = str(document['user_id'])

        return document
    return None


def get_upper(user_id, t):
    query = {
        'user_id':  ObjectId(user_id),
        'category': 'Upper body'
    }
    if t < 10:
        query['warmth'] = {
            '$gte': 66,
            '$lte': 100
        }
    if t >= 10 and t < 15:
        query['warmth'] = {
            '$gte': 34,
            '$lte': 66
        }

    if t >= 15:
        query['warmth'] = {
            '$gte': 0,
            '$lte': 33
        }

    pipeline = [
        {'$match': query},
        {'$sample': {'size': 1}}
    ]

    document = None
    result = list(item_collection.aggregate(pipeline))

    if result:
        document = result[0]

    if document is not None and '_id' in document:
        document['_id'] = str(document['_id'])

    if document is not None and 'user_id' in document:
        document['user_id'] = str(document['user_id'])

    return document


def get_lower(user_id, t):
    query = {
        'user_id':  ObjectId(user_id),
        'category': 'Lower body'
    }
    if t < 10:
        query['warmth'] = {
            '$gte': 66,
            '$lte': 100
        }
    if t >= 10 and t < 15:
        query['warmth'] = {
            '$gte': 34,
            '$lte': 66
        }

    if t >= 15:
        query['warmth'] = {
            '$gte': 0,
            '$lte': 33
        }

    pipeline = [
        {'$match': query},
        {'$sample': {'size': 1}}
    ]

    document = None
    result = list(item_collection.aggregate(pipeline))

    if result:
        document = result[0]

    if document is not None and '_id' in document:
        document['_id'] = str(document['_id'])

    if document is not None and 'user_id' in document:
        document['user_id'] = str(document['user_id'])

    return document


def get_jacket(user_id, t, w, p):
    document = None
    query = {
        'user_id':  ObjectId(user_id),
        'category': 'Jacket'
    }

    if p > 2.5 and p < 7.6:
        query['waterproof'] = {
            '$gte': 34,
            '$lte': 66
        }
    if p >= 7.6:
        query['waterproof'] = {
            '$gte': 66,
            '$lte': 100
        }
    if t < 10:
        query['warmth'] = {
            '$gte': 66,
            '$lte': 100
        }
    if t >= 10 and t < 15:
        query['warmth'] = {
            '$gte': 34,
            '$lte': 66
        }
    if t >= 15:
        query['warmth'] = {
            '$gte': 0,
            '$lte': 33
        }

    if w > 6 and w <= 20:
        query['windproof'] = {
            '$gte': 0,
            '$lte': 33
        }

    if w >= 20 and w < 30:
        query['windproof'] = {
            '$gte': 34,
            '$lte': 66
        }

    if w > 30:
        query['windproof'] = {
            '$gte': 66,
            '$lte': 100
        }

    pipeline = [
        {'$match': query},
        {'$sample': {'size': 1}}
    ]

    document = None
    result = list(item_collection.aggregate(pipeline))

    if result:
        document = result[0]

    if document is not None and '_id' in document:
        document['_id'] = str(document['_id'])

    if document is not None and 'user_id' in document:
        document['user_id'] = str(document['user_id'])

    return document


def get_foot(user_id, t, p):
    query = {
        'user_id':  ObjectId(user_id),
        'category': 'Footwear'
    }
    if p > 2.5 and p < 7.6:
        query['waterproof'] = {
            '$gte': 34,
            '$lte': 66
        }
    if p >= 7.6:
        query['waterproof'] = {
            '$gte': 66,
            '$lte': 100
        }
    if t < 10:
        query['warmth'] = {
            '$gte': 66,
            '$lte': 100
        }
    if t >= 10 and t < 15:
        query['warmth'] = {
            '$gte': 34,
            '$lte': 66
        }
    if t >= 15:
        query['warmth'] = {
            '$gte': 0,
            '$lte': 33
        }

    pipeline = [
        {'$match': query},
        {'$sample': {'size': 1}}
    ]

    document = None
    result = list(item_collection.aggregate(pipeline))

    if result:
        document = result[0]

    if document is not None and '_id' in document:
        document['_id'] = str(document['_id'])

    if document is not None and 'user_id' in document:
        document['user_id'] = str(document['user_id'])

    return document


def get_season_number(date):
    seasons = {
        0: (1, 2, 12),
        1: (3, 4, 5),
        2: (6, 7, 8),
        3: (9, 10, 11)
    }
    month = date.month
    for season, months in seasons.items():
        if month in months:
            return season
    return -1


def main():
    app.run(host='0.0.0.0', port=5000)


if __name__ == '__main__':
    main()
