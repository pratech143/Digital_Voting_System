<?php
class Autoloader
{
    public static function load($className)
    {
        $file = __DIR__ . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $className) . '.php';

        if (file_exists($file)) {
            require $file;
        }
    }
}

spl_autoload_register('Autoloader::load');
?>