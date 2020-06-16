// language=HTML
import {commonStyle} from './common-style.template';

export const instructionsEmailTemplate: string = `
     ${commonStyle}
     <style>
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

        .question {
            padding: 8px 0;
        }

        .question .question-header {
            font-weight: bold;
        }

        .question-options .question-option {
            margin: 2px 0;
        }

        .question-options .question-option .question-option-icon {
            padding: 4px;
            font-size: 18px;
        }
    </style>
    <div class="container">
        <div class="header">
            <img class="logo" src="https://lucrareamea.ro/wp-content/uploads/2019/10/Logo-Lucrareamea-redim.png">
        </div>
        <div class="content">

            <h1><%= title%></h1>

            <div class="py">
                <p class="p-none m-none">Revino la articol pentru etapele detaliate ale lucrării tale și pentru a
                    definitiva
                    comanda</p>
                <a target="_blank" href="<%= tutorialUrl %>"><%= tutorialUrl %></a>
            </div>

            <%- content %>
            <%- displayedSections %>

            <div class="py">
                <p class="p-none m-none">Continuarea articolului început de tine impreuna cu toate calculele pentru
                    lucrarea ta
                    le găsești la
                    link-ul de mai jos</p>
                <a target="_blank" href="<%= tutorialUrl %>"><%= tutorialUrl %></a>
            </div>


            <div class="py">
                <p class="p-none m-none">Dacă te mai interesează și alte subiecte despre casă și pentru acasă, te rugăm
                    să
                    accesezi</p>
                <a target="_blank" href="https://lucrareamea.ro/blog/">lucrareamea.ro/blog</a>
            </div>
        </div>

        <div class="footer">
            <p class="py">
                Ai primit acest email pentru că ai vizitat site-ul <a href="https://www.lucrareamea.ro">www.lucrareamea.ro</a>
                și ai optat să primești lista de produse gratuit pe mail. Dacă întâmpini vreo problemă, ai vreo
                nelămurire sau o sugestie te rugăm să ne contactezi pe email <a href="mailto: office@lucrareamea.ro">office@lucrareamea.ro</a>.
            </p>

            <p><strong>LucrareaMea.ro</strong> - DIY Projects Mkt SRL, Timișoara, str. Virgil Madgearu nr. 5.</p>
        </div>
    </div>
`;
