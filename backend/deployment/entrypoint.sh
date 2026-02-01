#!/bin/sh

# Exit on fail
set -e

# Wait for database to be ready (optional, good practice)
# echo "Waiting for database..."
# sleep 5

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Run seeders (careful in production, maybe check ENV)
# php artisan db:seed --force

# Clear and cache config
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions (just in case)
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Start Supervisor (which starts Nginx & PHP-FPM)
echo "Starting Supervisor..."
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
