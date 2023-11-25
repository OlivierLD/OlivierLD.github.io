#!/bin/bash
IDX=0
for img in $(ls *); do
  filename=$(echo "${img%.*}")
  extension=$(echo "${img##*.}")
  # echo -e "Image ${img}, File: ${filename}, ext: ${extension}"
  if [[ "${extension}" == "JPG" ]] || [[ "${extension}" == "jpg" ]]; then
    let "IDX+=1" 
    NEW_NAME=$(printf "%03d\n" $IDX)
    echo -e "${IDX} changing ${img} into ${NEW_NAME}.jpg ..."
    mv ${img} ${NEW_NAME}.jpg
  fi
done

