import React, { Component } from 'react';
import * as API from '../services/api';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

class App extends Component {
  state = {
    items: [],
    isLoading: false,
    searchQuery: '',
    pageNumber: 1,
    openModal: false,
    idForImage: '',
  };

  componentDidMount() {
    this.fetching();
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, pageNumber } = this.state;
    if (
      prevState.searchQuery !== searchQuery ||
      prevState.pageNumber !== pageNumber
    ) {
      this.fetching(searchQuery, pageNumber);
    }
  }

  fetching = (query, pageNumber) => {
    this.setState({ isLoading: true });
    API.getItems(query, pageNumber)
      .then(res =>
        this.setState(state => ({
          items: [...state.items, ...res.data.hits],
        })),
      )
      .catch(err => {
        throw new Error(err);
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  handleSubmit = value => {
    this.setState({ searchQuery: value, items: [], pageNumber: 1 });
  };

  clickImg = id => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal, idForImage: id });
  };

  clickMore = () => {
    this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }));
  };

  render() {
    const { items, isLoading, openModal, idForImage } = this.state;
    return (
      <>
        <SearchBar onSubmit={this.handleSubmit} />
        {isLoading && <Loader />}
        <ImageGallery items={items} clickImg={this.clickImg} />
        {items.length > 0 && <Button clickMore={this.clickMore} />}
        {openModal && (
          <Modal
            items={items}
            idForImage={idForImage}
            clickImg={this.clickImg}
          />
        )}
      </>
    );
  }
}

export default App;
