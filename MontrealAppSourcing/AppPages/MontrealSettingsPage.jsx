import AppLayout from "../AppHelpers/AppLayout"
import MontrealSettings from '../AppComponents/MontrealSettings';

const MontrealSettingsPage = () => {
    return (
        <AppLayout appRoute={<MontrealSettings />} skateMenu={true} />
    )
};

export default MontrealSettingsPage;