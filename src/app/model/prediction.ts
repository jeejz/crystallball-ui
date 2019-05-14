import { publish } from 'rxjs/operators';

export class Prediction{
    constructor(
        public WinningTeam :string,
        public ManOfTheMatch :string,
        public Toss :string,
        public FirstBat : string
    ){    }
}