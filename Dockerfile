sudo ./deploy.sh
[2025-06-05 17:30:05] Step 1: Updating system packages...
Hit:1 http://ap-southeast-1.ec2.archive.ubuntu.com/ubuntu jammy InRelease
Hit:2 http://ap-southeast-1.ec2.archive.ubuntu.com/ubuntu jammy-updates InRelease                              
Hit:3 http://ap-southeast-1.ec2.archive.ubuntu.com/ubuntu jammy-backports InRelease                            
Hit:4 https://download.docker.com/linux/ubuntu jammy InRelease                                                 
Hit:5 http://security.ubuntu.com/ubuntu jammy-security InRelease                                        
Reading package lists... Done
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
[2025-06-05 17:30:07] Step 2: Installing required packages...
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
lsb-release is already the newest version (11.1.0ubuntu4).
ca-certificates is already the newest version (20240203~22.04.1).
curl is already the newest version (7.81.0-1ubuntu1.20).
git is already the newest version (1:2.34.1-1ubuntu1.12).
gnupg is already the newest version (2.2.27-3ubuntu2.3).
openssl is already the newest version (3.0.2-0ubuntu1.19).
unzip is already the newest version (6.0-26ubuntu3.2).
apt-transport-https is already the newest version (2.4.14).
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
[2025-06-05 17:30:08] Step 3: Installing Docker...
[2025-06-05 17:30:08] Docker is already installed
[2025-06-05 17:30:08] Step 4: Installing Docker Compose...
[2025-06-05 17:30:08] Docker Compose is already installed
[2025-06-05 17:30:08] Step 5: Creating SSL certificates directory...
[2025-06-05 17:30:08] Step 6: Generating SSL certificates...
[2025-06-05 17:30:08] SSL certificate already exists
[2025-06-05 17:30:08] Step 7: Creating necessary directories...
[2025-06-05 17:30:08] Step 8: Setting proper permissions...
[2025-06-05 17:30:08] Step 9: Creating .env file...
[2025-06-05 17:30:08] .env file already exists
[2025-06-05 17:30:08] Step 10: Building Docker images...
WARN[0000] /home/ubuntu/ambulance/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
Compose can now delegate builds to bake for better performance.
 To do so, set COMPOSE_BAKE=true.
[+] Building 499.9s (43/52)                                                                                                                              docker:default
 => [app internal] load build definition from Dockerfile                                                                                                           0.0s
 => => transferring dockerfile: 2.31kB                                                                                                                             0.0s
 => [scheduler internal] load metadata for docker.io/library/composer:latest                                                                                       2.1s
 => [scheduler internal] load metadata for docker.io/library/php:8.2-fpm                                                                                           2.2s
 => [app internal] load .dockerignore                                                                                                                              0.0s
 => => transferring context: 2B                                                                                                                                    0.0s
 => [app internal] load build context                                                                                                                              0.0s
 => => transferring context: 36.52kB                                                                                                                               0.0s
 => [scheduler stage-0  1/16] FROM docker.io/library/php:8.2-fpm@sha256:5f4eef4011ea33153ced06c607c0bfa9f688af3331d9ccb2b858bb1195c816cd                           0.0s
 => CACHED [scheduler] FROM docker.io/library/composer:latest@sha256:623d15a4aae78c868a35c3942add4bb9b2f98e4a3ec26e1928c84df14695d4b0                              0.0s
 => CACHED [scheduler stage-0  2/16] WORKDIR /var/www                                                                                                              0.0s
 => [scheduler stage-0  3/16] RUN apt-get update && apt-get install -y     libpng-dev     libzip-dev     libonig-dev     libxml2-dev     libfreetype6-dev     li  29.9s
 => [scheduler stage-0  4/16] RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -     && apt-get install -y nodejs                                      17.4s 
 => [queue stage-0  5/16] RUN docker-php-ext-configure gd --with-freetype --with-jpeg     && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip  186.6s 
 => [queue stage-0  6/16] RUN {         echo 'opcache.memory_consumption=128';         echo 'opcache.interned_strings_buffer=8';         echo 'opcache.max_accele  0.4s 
 => [queue stage-0  7/16] COPY --from=composer:latest /usr/bin/composer /usr/bin/composer                                                                          0.1s 
 => [app stage-0  8/16] COPY package*.json ./                                                                                                                      0.1s 
 => [app stage-0  9/16] COPY composer.json composer.lock ./                                                                                                        0.0s 
 => [app stage-0 10/16] RUN composer install --no-dev --optimize-autoloader --no-scripts                                                                           6.0s 
 => [app stage-0 11/16] COPY . .                                                                                                                                   0.1s 
 => [app stage-0 12/16] RUN npm ci     && npm run build     && npm cache clean --force                                                                            14.8s 
 => [app stage-0 13/16] RUN composer dump-autoload --optimize                                                                                                      1.8s 
 => [app stage-0 14/16] RUN mkdir -p /var/www/storage/logs              /var/www/storage/framework/sessions              /var/www/storage/framework/views          0.2s 
 => [app stage-0 15/16] RUN chown -R www-data:www-data /var/www     && chmod -R 775 /var/www/storage /var/www/bootstrap/cache     && chmod -R 755 /var/www/publ  104.0s 
 => [app stage-0 16/16] RUN echo '* * * * * cd /var/www && php artisan schedule:run >> /dev/null 2>&1' > /etc/cron.d/laravel-scheduler     && chmod 0644 /etc/cro  0.2s 
 => [app] exporting to image                                                                                                                                       4.2s 
 => => exporting layers                                                                                                                                            4.2s 
 => => writing image sha256:930222a0e907c11514d50779622ac9b1009eceefbbde959e907d8ed988897977                                                                       0.0s
 => => naming to docker.io/library/ambulance-app                                                                                                                   0.0s
 => [app] resolving provenance for metadata file                                                                                                                   0.0s
 => [scheduler internal] load build definition from Dockerfile                                                                                                     0.0s
 => => transferring dockerfile: 2.31kB                                                                                                                             0.0s
 => [queue internal] load build definition from Dockerfile                                                                                                         0.0s
 => => transferring dockerfile: 2.31kB                                                                                                                             0.0s
 => [queue internal] load .dockerignore                                                                                                                            0.0s
 => => transferring context: 2B                                                                                                                                    0.0s
 => [scheduler internal] load .dockerignore                                                                                                                        0.0s
 => => transferring context: 2B                                                                                                                                    0.0s
 => [queue internal] load build context                                                                                                                            0.0s
 => => transferring context: 34.24kB                                                                                                                               0.0s
 => [scheduler internal] load build context                                                                                                                        0.1s
 => => transferring context: 5.72MB                                                                                                                                0.1s
 => [scheduler stage-0  8/16] COPY package*.json ./                                                                                                                0.0s 
 => [scheduler stage-0  9/16] COPY composer.json composer.lock ./                                                                                                  0.0s 
 => [scheduler stage-0 10/16] RUN composer install --no-dev --optimize-autoloader --no-scripts                                                                     6.5s 
 => [scheduler stage-0 11/16] COPY . .                                                                                                                             0.1s 
 => [queue stage-0 12/16] RUN npm ci     && npm run build     && npm cache clean --force                                                                          14.8s 
 => [queue stage-0 13/16] RUN composer dump-autoload --optimize                                                                                                    1.9s 
 => [queue stage-0 14/16] RUN mkdir -p /var/www/storage/logs              /var/www/storage/framework/sessions              /var/www/storage/framework/views        0.2s 
 => [queue stage-0 15/16] RUN chown -R www-data:www-data /var/www     && chmod -R 775 /var/www/storage /var/www/bootstrap/cache     && chmod -R 755 /var/www/pu  103.7s 
 => [scheduler stage-0 16/16] RUN echo '* * * * * cd /var/www && php artisan schedule:run >> /dev/null 2>&1' > /etc/cron.d/laravel-scheduler     && chmod 0644 /e  0.2s 
 => [scheduler] exporting to image                                                                                                                                 4.3s 
 => => exporting layers                                                                                                                                            4.3s 
 => => writing image sha256:0c6e470e4d357f5c15651afd2ac827c888c420b2d03f6705792ebee2587e2b30                                                                       0.0s 
 => => naming to docker.io/library/ambulance-scheduler                                                                                                             0.0s
 => [queue] exporting to image                                                                                                                                     4.3s
 => => exporting layers                                                                                                                                            4.3s
 => => writing image sha256:7c98603e3f00192b055401654a1288f04e4d0ddd26fe7de2a512d7843c9589ef                                                                       0.0s
 => => naming to docker.io/library/ambulance-queue                                                                                                                 0.0s
 => [scheduler] resolving provenance for metadata file                                                                                                             0.0s
 => [queue] resolving provenance for metadata file                                                                                                                 0.0s
[+] Building 3/3
 ✔ app        Built                                                                                                                                                0.0s 
 ✔ queue      Built                                                                                                                                                0.0s 
 ✔ scheduler  Built                                                                                                                                                0.0s 
[2025-06-05 17:38:28] Step 11: Starting the application...
WARN[0000] /home/ubuntu/ambulance/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
WARN[0000] /home/ubuntu/ambulance/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 21/21
 ✔ db Pulled                                                                                                                                                      13.8s 
   ✔ 9845df06f911 Pull complete                                                                                                                                    2.2s 
   ✔ 3712612ad38e Pull complete                                                                                                                                    2.2s 
   ✔ 8a6f22c2a368 Pull complete                                                                                                                                    2.3s 
   ✔ e7538c64aa23 Pull complete                                                                                                                                    2.5s 
   ✔ bd7cf35c549b Pull complete                                                                                                                                    2.6s 
   ✔ ef9f7d69eeea Pull complete                                                                                                                                    2.6s 
   ✔ ce8c85482c47 Pull complete                                                                                                                                    3.6s 
   ✔ 257be63a0a4a Pull complete                                                                                                                                    3.6s 
   ✔ b50eaf784a56 Pull complete                                                                                                                                    9.7s 
   ✔ 641b98ec0cd7 Pull complete                                                                                                                                   10.2s 
   ✔ e3f459c41d34 Pull complete                                                                                                                                   10.4s 
 ✔ webserver Pulled                                                                                                                                                9.0s 
   ✔ f18232174bc9 Already exists                                                                                                                                   0.0s 
   ✔ 61ca4f733c80 Pull complete                                                                                                                                    3.8s 
   ✔ b464cfdf2a63 Pull complete                                                                                                                                    3.8s 
   ✔ d7e507024086 Pull complete                                                                                                                                    4.0s 
   ✔ 81bd8ed7ec67 Pull complete                                                                                                                                    4.4s 
   ✔ 197eb75867ef Pull complete                                                                                                                                    4.6s 
   ✔ 34a64644b756 Pull complete                                                                                                                                    4.7s 
   ✔ 39c2ddfd6010 Pull complete                                                                                                                                    5.5s 
[+] Running 6/6
 ✔ Network ambulance_ambulance_network  Created                                                                                                                    0.0s 
 ✘ Container ambulance_db               Error                                                                                                                     12.8s 
 ✔ Container ambulance_app              Created                                                                                                                    0.0s 
 ✔ Container ambulance_webserver        Created                                                                                                                    0.1s 
 ✔ Container ambulance_queue            Created                                                                                                                    0.1s 
 ✔ Container ambulance_scheduler        Created                                                                                                                    0.1s 
dependency failed to start: container ambulance_db is unhealthy