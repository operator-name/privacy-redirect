#!/usr/bin/env bash

N=10;

printf "average\tmin\tmax\tstd\thostname\n"
for i in $(echo -e "nitter-instance-list\ninvidious-instances-list\nbibliogram-instance-list"); do 
	for url in $(cat popup.html | pup "datalist#$i" | pup 'option attr{value}'); do 
		host=$(echo $url | sed 's:.*//::'); 
		ping -c "$N" "$host" | tail -1 | awk '{print $4}' | awk -F '/' -v OFS='\t' -v ORS='\t' '{print $2, $1, $3, $4}' && printf "$host\n"
	done; 
	echo; 
done
