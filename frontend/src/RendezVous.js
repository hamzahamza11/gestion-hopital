import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItemPatient from './ListItemPatient';
import ListItemMedecin from './ListItemMedecin';
import axios from 'axios';
import RDVCalender from './RDVCalender';
const styles = {
    root: {
        width: "100%",
        height: "100%"
    }
}

class RendezVous extends React.Component{
    constructor(props){
        super(props);
        this.state = {patientChosen: false, medecinChosen: false, 
                      dataPatient: [],serachPatient: [], patient:'',
                      dataMedecin: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.newRendezVous = {
            dateR: '2020-05-25 12:45:55',
            service: 'consultation',
            presence: false,
            prix: 255.0,
            date: '2020-05-25 12:45:55',
            cheminDeBilan: 'fill it later',
            idPatient: '1401',
            idMedecin: '1102'
        };
    }

    choosePatient = id => {
        this.setState({patientChosen: true});
        this.newRendezVous.idPatient = id;
        alert('patient choisi', id);
        
    }

    chooseMedecin = id => {
        this.setState({medecinChosen: true}); 
        this.newRendezVous.idMedecin = id;
        alert('medecin choisi',id);
        console.log(this.newRendezVous);
    }

    getDate = date => {
        this.newRendezVous.date = date;
        axios.post('api/RendezVous',this.newRendezVous);
        //console.log(this.newRendezVous);
    }
  async componentDidMount(){
       const dataPatient = await axios('/api/allPatients');
       const dataMedecin = await axios('/api/allMedecin');
       this.setState({dataPatient: dataPatient.data, dataMedecin: dataMedecin.data});
       //console.log(dataPatient.data);
    }
   handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        
    this.chercher(e.target.value);
         
    }

    chercher = cle => {
        let patient = this.state.dataPatient.filter(elm => elm.nom.concat(...[' ',elm.prenom,' ',elm.cin,' ',elm.tele]).toLowerCase().includes(cle.toLowerCase()));
        this.setState({searchPatient: patient});
    }
render(){ 
    const {classes} = this.props;
    const {patient} = this.state;
    let allPatients;
    let render = (<div className={classes.root} id="middle">
                     <RechercheBar />
                     <h3>Loading...</h3>  
                  </div>);
    if(this.state.dataPatient.length > 0 && !this.state.patientChosen){
      allPatients = this.state.dataPatient.map((elm, indx)=> <ListItemPatient key={elm.id} data={elm} onClick={this.choosePatient} />);
      render = (<div className={classes.root} id="middle">
        <div>
            <input className="searchList" type="text" placeholder="Chercher Medecin" 
            name="patient" 
            value={patient} 
            onChange={this.handleChange}  
            />
        </div>
        {allPatients}
     </div>);
     if(this.state.patient.length > 0){
        allPatients = this.state.searchPatient.map((elm, indx)=> <ListItemPatient key={elm.id} data={elm} onClick={this.choosePatient} />);
        render = (<div className={classes.root} id="middle">
          <div>
              <input className="searchList" type="text" placeholder="Chercher Medecin" 
              name="patient" 
              value={patient} 
              onChange={this.handleChange}  
              />
          </div>
          {allPatients}
          </div>);  
    }
    }else
    if(!this.state.medecinChosen && this.state.patientChosen){
        let allMedecin = this.state.dataMedecin.map(elm => <ListItemMedecin key={elm.id} data={elm} onClick={this.chooseMedecin} />)
        render = (<div className={classes.root} id="middle">
                    <RechercheBar />
                    {allMedecin} 
                   </div>);
    } else if(this.state.medecinChosen && this.state.patientChosen) {
        render = (<div className={classes.root} id="middle">
                      <RDVCalender chooseRDV={this.getDate} />
                </div>);
    }                
   return render;
}
}


function RechercheBar(){
    return (
        <div>
            <input className="searchList" type="text" placeholder="Chercher Medecin"  />
        </div>
    );
}



export default withStyles(styles)(RendezVous);