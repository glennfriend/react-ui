<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-type' content='text/html; charset=utf-8'>
    <title>Example</title>
    <script src="dist/jquery/jquery-2.0.3.js"></script>
    <script src="dist/bootstrap-3.3.5-dist/js/bootstrap.js"></script>
    <link rel="stylesheet" href="dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" />

    <script src="dist/react-0.13.3/build/react.js"></script>
    <script src="dist/react-0.13.3/build/JSXTransformer.js"></script>
    <script src="dist/react-bootstrap/react-bootstrap.min.js"></script>
  </head>
  <body>

    <section>
        <div class="navbar navbar-inverse navbar-static-top">
            <div class="container">
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <?php
                            echo '<li><a href="index.php">Home</a></li>';
                            foreach (getAllFolder(getPathName()) as $name) {
                                $name = basename($name);
                                if ('home'===$name) {
                                    continue;
                                }
                                echo '<li><a href="?page='. $name .'">'. $name .'</a></li>';
                            }
                        ?>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section style="margin:20px;">
        <?php
            $page = getPathName() .'/'. getPage();
            foreach (getAllFolder(getPathName()) as $folder) {
                if ($folder == $page) {
                    $file = $folder.'/main.php';
                    if (file_exists($file)) {
                        include $file;
                        break;
                    }
                    break;
                }
            }
        ?>
    </section>

  </body>
</html>
<?php

    function getPage($defaultValue='home')
    {
        return isset($_GET['page']) ? trim($_GET['page']) : $defaultValue;
    }

    function getPathName()
    {
        return 'src';
    }

    function getAllFolder($pathName)
    {
        $folders = [];
        foreach (glob($pathName.'/*', GLOB_ONLYDIR) as $folder) {
            $folders[] = $folder;
        }
        return $folders;
    }

?>
