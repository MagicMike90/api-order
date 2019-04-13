openssl req -newkey rsa:2048 -nodes -keyout keytemp.pem -x509 -days 365 -out cert.pem
openssl rsa -in keytemp.pem -out key.pem