FROM python:3.10
RUN apt-get update \
    && apt-get install -y nginx
RUN rm -rf /usr/share/nginx/html/*
COPY ./gui/build /var/www/html
COPY ./api .
RUN pip install -r requirements.txt
CMD service nginx start && uvicorn chatapi:app --host 0.0.0.0 --port 8000