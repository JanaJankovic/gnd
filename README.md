# Guess & Dress

## Description

A fashion app designed to help people dress appropriately for the weather and look fashionable at the same time. The app recommends outfits based on the weather forecast, considering temperature, precipitation and wind speed. It can be tailored to the user's preferred colour, clothing style, etc.

<p align='center'>
<img src='./src/visualisation/client_demo.png' alt='Application demo'>
</p>

## Set up ZTIS

Make sure you have installed:

- node v16
- angular cli
- mongoDB server and mongoDB compass

Project is simplified to just front-end and back-end without ML. To start the project follow the steps given below:

- Clone the repository
- Open command prompt in the root and run `set MONGO_URI=mongodb://127.0.0.1/gnd`
- Before starting the server make sure you have installed following packages

```
pip install Flask Flask-Cors pymongo pandas python-dotenv
```

- To start the server run

```
python src/server/server.py
```

- To start the front-end run

```
cd src/client
npm i
ng serve --open
```

Since this is instruction for ZTIS subject, ignore the rest of the document.

## Prerequisites

- [poetry](https://python-poetry.org/docs)
- [Docker](https://www.docker.com)
- [Node.js](https://nodejs.org/en)
- [DVC](https://dvc.org)

## Environment

To launch the application, create an `.env` file in the root directory of the project. Define `MLFLOW_TRACKING_USERNAME` and `MLFLOW_TRACKING_PASSWORD`, then set their values to valid [MLFlow credentials](https://dagshub.com/docs/integration_guide/mlflow_tracking/index.html). Define `MONGO_URI` and set its value to a valid Mongo connection.

## Installation and launch

Execute the following command to install and launch the application:

```bash
› docker compose up --build
```

Application's user interface is available at [localhost:4200](http://localhost:4200). REST API is listening at [localhost:8080/predict](http://localhost:8080/predict) and accepts the following data structure:

```json
{
  "location": "Maribor",
  "data": [
    {
      "temp_max": 0,
      "temp_min": 0,
      "radiation": 0,
      "rain": 0,
      "snowfall": 0,
      "wind_gust": 0,
      "wind_direction": 0
    }
  ]
}
```

## Important

Ensure that the whiteboard document is consistently updated with any revisions related to the project's progress. It is crucial to share essential information among team members to minimize the need for time-consuming searches and ensure that contributors have constant access to the required information.
Progress is tracked in <b>[this Google Document](https://docs.google.com/document/d/1kkmlhCGvAvWRgOTEcdRaxevE33DR36rsBpRtbFksxjM/edit?usp=sharing)</b>.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the `LICENSE` file for details.
