#!/usr/bin/env nix-shell
#!nix-shell -i bash --pure -p go-pup iputils 

N=1;

function help {
	printf "Usage: $0 [-n runs]\n"
	printf "\t-n runs\tthe number of times to ping"
	
}

while test $# -gt 0; do
	case "$1" in
		-h|--help)
			help
			exit 0
			;;
		-p|--pings)
			shift
			if test $# -gt 0; then
				N=$1
			else
				help
			fi
			shift
			;;
		*)
			break
			;;
	esac
done		

printf "average\tmin\tmax\tstd\thostname\t$N runs\n";
for i in $(echo -e "nitter-instance-list\ninvidious-instances-list\nbibliogram-instance-list"); do 
	for url in $(cat popup.html | pup "datalist#$i" | pup 'option attr{value}'); do 
		host=$(echo $url | sed 's:.*//::'); 
		ping -c "$N" "$host" 2> /dev/null | ((tail -1 | awk '{print $4}' | awk -F '/' -v OFS='\t' -v ORS='\t' '{print $2, $1, $3, $4}') && echo "$host");
	done; 
	echo; 
done
