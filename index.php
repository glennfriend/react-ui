<?php
    header('Content-Type: text/html; charset=utf-8');
    define('BASE_PATH',__DIR__);
    include 'lib/helper.php';

    $mainPage = get('m', 'Home');
    $subPage  = get('s');
    if ( !$subPage ) {
        $subPage = getDefaultSubMenu($mainPage);
    }


?><!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-type' content='text/html; charset=utf-8'>
    <title>Example</title>
    <script src="build/assets/jquery/jquery.js"></script>
    <script src="build/assets/bootstrap/js/bootstrap.js"></script>
    <link rel="stylesheet" href="build/assets/bootstrap/css/bootstrap.min.css" />

    <link rel="stylesheet" href="build/assets/font-awesome/css/font-awesome.css" />

    <script src="build/assets/react/react.js"></script>
    <script src="build/assets/react/JSXTransformer.js"></script>
    <script src="dist/utils.js"></script>
  </head>
  <body>

    <section>
        <div class="navbar navbar-inverse navbar-static-top">
            <div class="container">
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <?php
                            foreach ( getMainMenu() as $name ) {
                                $class='';
                                if ( $mainPage == $name ) {
                                    $class='active';
                                }
                                echo '<li class="'.$class.'"><a href="?m='. $name .'">'. $name .'</a></li>';
                            }
                        ?>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section style="margin:20px;">
        <div class="row">
            <div class="col-md-2">

                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"></h3>
                    </div>
                    <div class="list-group">
                    <?php
                        foreach ( getSubMenu($mainPage) as $name ) {
                            $class='';
                            if ( $subPage == $name ) {
                                $class='active';
                            }
                            echo '<a class="list-group-item '. $class .'" href="?m='. $mainPage .'&s='. $name .'">'. $name .'</a>';
                        }
                    ?>
                    </div>
                </div>

            </div>
            <div class="col-md-10">
                <?php showContent($mainPage, $subPage); ?>
                <?php showCompileJs($mainPage, $subPage); ?>
            </div>
        </div>


    </section>

  </body>
</html>
<?php

    function showContent( $mainPage, $subPage )
    {
        $path = getMenuPath($mainPage, $subPage);
        if ( $path ) {
            $file = $path.'/main.php';
            if (file_exists($file)) {
                include $file;
            }
        }
    }

    function showCompileJs( $mainPage, $subPage )
    {
        $pathfile = getMenuPath($mainPage, $subPage) . '/compile.tmp.js';
        if ( !file_exists($pathfile) ) {
            return;
        }
        echo '<'. 'script src="'. $pathfile .'"></script>';
    }

