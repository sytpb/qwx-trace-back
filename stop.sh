  
echo "Stopping nodejs Application[Trace Service:5050]"

#kill -9 $(ps -ef|grep ./bin/www|gawk '$0 !~/grep/ {print $2}' |tr -s '\n' ' ')
kill -9 $(netstat -nlp | grep :5050 | awk '{ print $7}' | awk -F"/" '{ print $1 }') 
