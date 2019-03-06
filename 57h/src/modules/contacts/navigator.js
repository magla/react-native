import { StackNavigator } from 'react-navigation';
import { createStackOptions } from '~/modules/navigation';
import {
  ContactDetailsScreen,
  NewContactScreen,
  AddContactScreen,
  EditContactScreen,
} from './fragments';

export default StackNavigator(
  {
    'Contacts.Details': {
      screen: ContactDetailsScreen,
    },
    'Contacts.Add': {
      screen: AddContactScreen,
    },
    'Contacts.New': {
      screen: NewContactScreen,
    },
    'Contacts.Edit': {
      screen: EditContactScreen,
    },
  },
  {
    navigationOptions: createStackOptions(),
  }
);
