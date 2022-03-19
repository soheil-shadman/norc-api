import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class MobileSensor extends Sequelize.Model {

}
MobileSensor.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    dateTime: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    sessionId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    geoTime: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    accelerationX: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    accelerationY: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    accelerationZ: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    accelerationLength: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    pressureHectoPascal: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    headingMagneticNorth: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    locationLatitude: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    locationLongitude: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    locationAccuracy: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    locationVerticalAccuracy: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    locationSpeed: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    locationCourseTrueNorth: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    lcationIsFromMockProvider: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    locationAltitudeRefrenceSystem: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    angularVelocityX: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    angularVelocityY: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    angularVelocityZ: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    angularVelocityLength: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    magneticFieldX: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    magneticFieldY: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    magneticFieldZ: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    magneticFieldLength: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    orientationX: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    orientationy: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    orientationZ: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    orientationW: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    orientationLength: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    orientationIsIdentity: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

}, {
    sequelize: dbConnection,
    modelName: 'mobile_sensor',
});
MobileSensor.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}