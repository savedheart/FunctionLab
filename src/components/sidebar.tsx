/*import graphs from './assets/graphs.svg'
import nummeth from './assets/nummeth.svg'
import equations from './assets/equations.svg'*/ 
/*need to add images*/

import { Link } from "react-router-dom";

function Sidebar(){
    return(
        <aside>
            <nav>
                <ul>
                    <li>
                        <Link to="/graphs">
                            <img src="" alt="" />
                            <span>Graphs</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <img src="" alt="" />
                            <span>Numerical methods</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <img src="" alt="" />
                            <span>Equations</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar;