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
            getRows() {
                return {
                    heads: ['name','price','stocked'],
                    rows: [
                            { name: "Football"    ,price: 49.99,  stocked: true,                      },
                            { name: "Baseball"    ,price: 9.99,   stocked: true,                      },
                            {                      price: 29.99,  stocked: false, name: "Basketball"  },
                            { name: "iPod Touch"  ,price: 99.99,  stocked: true,                      }
                    ],
                }
            },

            getRows2() {
                // 假設是 ajax 的過程
                var table = this.state.table;
                table.rows = [
                    { name: "iPhone 5", price: 399.99, stocked: false   },
                    { name: "Nexus 7",  price: 199.99, stocked: true    }
                ];
                this.setState({"table": table});
            },

            rowChange(row) {
                if ( row.stocked === true ) {
                    row.stocked = 'TRUE';
                }
                return row;
            },

            // --------------------------------------------------------------------------------
            getInitialState() {
                return {
                    table: this.getRows(),
                };
            },

            render() {
                return (
                    <div>
                        <Sg.Table data={this.state.table} handleRow={this.rowChange} />

                        <ReactBootstrap.Button bsStyle='primary' onClick={this.getRows2}>
                            get rows 2
                        </ReactBootstrap.Button>
                    </div>
                );
            },
        });
        React.render(<Main />, document.getElementById('content'));
    </script>

  </body>
</html>
