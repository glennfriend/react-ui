<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-type' content='text/html; charset=utf-8'>
    <title>Example</title>
    <?php include '_head.htm'; ?>
  </head>
  <body>

    <?php include '_menu.htm'; ?>
    <section style="margin:20px;">
        <div id="content"></div>
    </section>

    <script type="text/jsx" src="dist/react-stargazer/table.js"></script>
    <script type="text/jsx">
        var Main = React.createClass({
            // --------------------------------------------------------------------------------
            // event
            // --------------------------------------------------------------------------------
            page(n) {
                console.log('click page '+n);
            },

            // --------------------------------------------------------------------------------
            getInitialState() {
                return {
                    table: {
                        heads: ['category','price','stocked','name'],
                        rows: [
                                {category: "Sporting Goods1", price: "$49.99", stocked: true, name: "Football"},
                                {                             price: "$9.99", stocked: true, name: "Baseball", category: "Sporting Goods2"},
                                {category: "Sporting Goods3", price: "$29.99", stocked: false, name: "Basketball"},
                                {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
                                {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
                                {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
                        ],
                    }
                };
            },

            render() {
                return (
                    <div>
                        <Sg.Table data={this.state.table} />
                    </div>
                );
            },
        });
        React.render(<Main />, document.getElementById('content'));
    </script>

  </body>
</html>
