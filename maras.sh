#!/bin/bash

# Handle command line arguments
for i in "$@"
do
case $i in 
	-m=*|--metamap=*)
	METAMAP="${i#*=}"
	shift
	;;
	-f=*|--faers=*)
	FAERS="${i#*=}"
	shift
	;;
	-d=*|--drugpath=*)
	DRUGPATH="${i#*=}"
	shift
	;;
	-r=*|--rulepath=*)
	RULEPATH="${i#*=}"
	shift
	;;
	-o=*|--outpath=*)
	OUTPATH="${i#*=}"
	shift
	;;
	-j=*|--jar=*)
	JAR="${i#*=}"
	shift
	;;
	-t=*|--status==*)
	STATUS="${i#*=}"
	shift
	;;
	*)

	;;
esac
done
echo "STARTING METAMAP"
/maras/metamap.sh &
# Wait 5 seconds to give MetaMap time to initialize
sleep 10
echo "STARTING MARAS"
java -jar ${JAR} -f ${FAERS} -d ${DRUGPATH} -m ${METAMAP} -t ${STATUS} -Xms2G -Xmx6G
echo "DONE"
