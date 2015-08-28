<ul>
    <li>utils</li>
    <ul>
        <li>該工具只用於 React Component</li>
        <li>"不要" 在 React Component 以外的地方使用</li>
    </ul>
</ul>

<style>
    pre.display {
        background-color: #ffffff;
        border: 0px;
        display: none;
    }
</style>
<script>
    "use strict";

    var message = '';
    function echo(msg)
    {
        var tmp = '';
        for ( var i = 0; i < arguments.length; i++) {
            if ( '' === tmp ) {
                tmp = arguments[i];
            }
            else {
                tmp += ' ' + arguments[i];
            }
        }
        if ( !message ) {
            message = tmp;
        }
        else {
            message += "\n" + tmp;
        }
    }

    function output()
    {
        var output = message;
        message = '';
        return output;
    }

    $(function() {

        $(".js-return").each(function(){
            var that = this;
            $(this).append('<input style="float:right" type="button" value="return" />');
            $(this).children('input').on('click', function(){
                var code = $(this).parent().text();
                var run = new Function('return ' + code);
                $(that).next('pre').css('display', 'block');
                $(that).next('pre').text( run() );
            });
        });

        $(".js-show").each(function(){
            var that = this;
            $(this).append('<input style="float:right" type="button" value="show" />');
            $(this).children('input').on('click', function(){
                var code = $(this).parent().text();
                var run = new Function(code);
                run();
                $(that).next('pre').css('display', 'block');
                $(that).next('pre').text( output() );
            });
        });

    });

</script>

<hr />
<div>

    <p>
        <pre class="js-return">utils.getUniqueId()</pre>
        <pre class="display"></pre>
    </p>

    <p>
        <pre class="js-return">utils.getUniqueId('hello-')</pre>
        <pre class="display"></pre>
    </p>

    <p>
        <pre class="js-show">
var obj = {
    name: 'john',
    birth: new Date(Date.UTC(2000, 12-1, 31, 23, 59, 59)).toISOString(),
    age: Math.floor(Math.random()*100 + 1)
}
utils.each(obj, function(key, value){ 
    echo(key, value);
})</pre>
        <pre class="display"></pre>
    </p>

    <p>
        <pre class="js-show">
var list = [
    'john',
    '2000-01-01',
    Math.floor(Math.random()*100 + 1)
];
utils.each(list, function(key, value){ 
    echo(key, value);
})</pre>
        <pre class="display"></pre>
    </p>

</div>

