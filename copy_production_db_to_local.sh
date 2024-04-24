#!/bin/bash
# Run on local machine
# ./copy_production_db_to_local.sh

# Define variables
CONTAINER_ID=""
VPS_SSH=""

PG_USERNAME="postgres"
PG_DATABASE="mimi_db"

LOCAL_PG_USERNAME="postgres"
LOCAL_PG_DATABASE="mimi_db"

TIME_STAMP=$(date +%d-%m-%Y)
NAME_FILE_BACKUP="mimi_backup_db_$TIME_STAMP.dump"

# 1. Export database from PostgreSQL container on VPS
echo "1. Exporting the database from the PostgreSQL container on VPS..."
ssh $VPS_SSH "docker exec -t $CONTAINER_ID pg_dump -U $PG_USERNAME -d $PG_DATABASE -F c -f /home/$NAME_FILE_BACKUP \
&& docker cp $CONTAINER_ID:/home/$NAME_FILE_BACKUP /home \
&& docker exec -t $CONTAINER_ID rm /home/$NAME_FILE_BACKUP" \
&& echo "Export completed" \
&& echo "Dump file removed from container." \
&& echo ""

# 2. Copy the dump file from VPS to the local machine
echo -e "2. Copying the dump file from VPS to the local machine..."
scp $VPS_SSH:/home/$NAME_FILE_BACKUP ~/Downloads/ \
&& echo "Copy completed!" \
&& echo ""

# 3. Remove the dump file from VPS
echo -e "3. Removing the dump file from VPS..."
ssh $VPS_SSH "rm /home/$NAME_FILE_BACKUP" \
&& echo "Dump file removed from VPS." \
&& echo ""

# 4. Import the database to the local machine
echo -e "4. Importing the database to the local machine..."
pg_restore -U $LOCAL_PG_USERNAME -d $LOCAL_PG_DATABASE -F c --clean ~/Downloads/$NAME_FILE_BACKUP \
&& echo "Import completed!" \
&& echo ""

# Remove the dump file from the local machine
# echo -e "5. Removing the dump file from the local machine..."
# rm ~/Downloads/$NAME_FILE_BACKUP \
# && echo "Dump file removed from local machine." \
# && echo ""

echo -e "6. Database copy completed!"
