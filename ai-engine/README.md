# AI Engine Service (Python)

## Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI (for serving predictions)
- **ML Libraries**: TensorFlow/PyTorch, scikit-learn, FEAST
- **Data**: Pandas, NumPy

## Initialization

Place your `requirements.txt` here and use the `Dockerfile` to build the image.

## Key Modules to Implement

1.  `market_scanner.py`: Connects to Kafka/Redis to read ticks.
2.  `feature_pipeline.py`: Calculates indicators (RSI, MACD).
3.  `model_server.py`: Exposes HTTP/gRPC endpoints for predictions.
