function mutationFunction(phenotype) {
    // make a random change to phenotype
    return phenotype
}

function crossoverFunction(phenotypeA, phenotypeB) {
    // move, copy, or append some values from a to b and from b to a
    return [ phenotypeA , phenotypeB ]
}

function fitnessFunction(phenotype) {
    const powerFactor = phenotype.watt*4;
    const noiseFactor = phenotype.fan * phenotype.noise;
    const tempFactor=   phenotype.temp*5;
    const performance = phenotype.hashrate/(powerFactor+noiseFactor+tempFactor);
    return performance;

}

var geneticAlgorithmConstructor = require('geneticalgorithm');
var db= require('./db');
db.fetchLastStatus(1, 50, pop =>{
    var geneticAlgorithm = geneticAlgorithmConstructor({
        mutationFunction: mutationFunction,
        crossoverFunction: crossoverFunction,
        fitnessFunction: fitnessFunction,
        population: pop
    });


    console.log("Starting with:")
    console.log( pop )
    for( var i = 0 ; i < 100 ; i++ ) geneticAlgorithm.evolve()
    var best = geneticAlgorithm.best()
    delete best.score
    console.log("Finished with:")
    console.log(best)


})
