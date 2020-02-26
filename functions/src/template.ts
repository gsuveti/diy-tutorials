// language=HTML
export const template: string = `
    <style>
        .container {
            padding: 32px;
            background-color: rgb(247, 247, 247);
        }

        .content {
            max-width: 632px;
            margin: auto;
            padding: 16px;
            background-color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            box-sizing: border-box;
            border-radius: 4px;
        }

        .header {
            padding-bottom: 32px;
        }

        .header .logo {
            display: block;
            width: 200px;
            margin: auto;
        }

        img {
            width: 100%;
        }

        .products, .optional-products {
            display: table;
            width: 100%;
        }

        .products .product, .optional-products .product {
            display: inline-block;
            width: 33.33%;
            padding: 2px;
            box-sizing: border-box;
        }


        .product-content {
            display: block;
            border: 1px solid gray;
            border-radius: 2px;
            height: 200px;
            padding: 0 8px;
            overflow: hidden;
        }

        .product h3 {
            font-size: 14px;
        }

        .products-title, .optional-products-title {
            font-size: 18px;
            padding-top: 8px;
        }


        .instances-question label, .measurement-label {
            display: block;
            border: 1px solid #cacaca;
            padding: 4px;
            margin: 2px 0;
            border-radius: 2px;

        }

        .instances-question label > *, .measurement-label > * {
            display: inline-block;
            width: 50%;
            border-left: 1px solid #cacaca;
            padding-left: 4px;
            float: right;
        }


    </style>
    <div class="container">
        <div class="header">
            <img class="logo" src="https://lucrareamea.ro/wp-content/uploads/2019/10/Logo-Lucrareamea-redim.png">
        </div>
        <div class="content">

            <h1><%= title%></h1>
            <%- content %>
            <%- displayedSections %>

            <br>

            <%if (requiredProductsTotal > 0) { %>
            <div class="products">
                <h2 class="products-title">Produse necesare (<%= requiredProductsTotal %> lei)</h2>

                <% requiredProducts.forEach(function(product){ %>
                <div class="product">
                    <div class="product-content">
                        <h3><a target="_blank" href="<%= product.url %>"><%= product.headline %></a> x <%=
                            productQuantities[product.uuid] %></h3>
                        <figure>
                            <img src="<%= product.imageUrl %>"/>
                        </figure>
                    </div>
                </div>
                <% }); %>
            </div>
            <% } %>

            <%if (optionalProductsTotal > 0) { %>
            <div class="optional-products">
                <h2 class="optional-products-title">Produse opționale (<%= optionalProductsTotal %> lei)</h2>

                <% optionalProducts.forEach(function(product){ %>
                <div class="product">
                    <div class="product-content">
                        <h3><a target="_blank" href="<%= product.url %>"><%= product.headline %></a> x <%=
                            productQuantities[product.uuid] %></h3>
                        <figure>
                            <img src="<%= product.imageUrl %>"/>
                        </figure>
                    </div>
                </div>
                <% }); %>
            </div>
            <% } %>
        </div>
    </div>
`;
