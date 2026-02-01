FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    supervisor \
    nginx

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Create log directory for supervisor
RUN mkdir -p /var/log/supervisor

# Copy deployment config
COPY deployment/nginx.conf /etc/nginx/sites-available/default
COPY deployment/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY deployment/entrypoint.sh /usr/local/bin/entrypoint.sh

# Make entrypoint executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80
EXPOSE 80

# Start supervisor (which starts nginx and php-fpm)
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
