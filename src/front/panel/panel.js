import browser from 'webextension-polyfill';

import DOMPurify from 'dompurify';

import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import useNbUnreads from "../hooks/useNbUnreads";
import useRSSFeeds from "../hooks/useRSSFeeds";
import useParams from "../hooks/useParams";

import NavBar from "../components/NavBar";
import Icon from "../components/Icon";
import openLink from '../../both/openLink';

import 'bootstrap';
import './styles.scss';

import {
  EVENT_REQUEST_RSS,
  EVENT_REQUEST_SWAP,
  PARAM_URL_MAIN
} from "../../both/constants";

function RSSItem({rss, onSwapItem}) {
  const {id, isRead: isRead_, origin, link, title, content} = rss;
  const [isRead, setIsRead] = useState(isRead_);
  const [collapse, setCollapse] = useState(true);
  
  const docHTML = new DOMParser().parseFromString(DOMPurify.sanitize(content), 'text/html');
  
  const attachHtmlContent = node => {
    if (!node) return;

    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    while (docHTML.body.hasChildNodes()) {
      node.appendChild(docHTML.body.firstChild);
    }
    
    node.querySelectorAll('a')
      .forEach(a => a.addEventListener('click', event => {
        event.preventDefault();
        
        a.target = '_blank';
        openLink(a.href);
      }));
  };
  
  const onSwapClick = (event) => {
    event.preventDefault();
  
    onSwapItem(rss);
    setIsRead(isRead => !isRead);
  };
  
  const onTitleClick = (event) => {
    event.preventDefault();
  
    openLink(link, true);
  };
  
  return (
    <div className="rss-item card w-100 bg-dark text-light mb-2" style={{order: id}}>
      <div className="card-header bg-secondary">
        <div className="card-title mb-0 d-flex align-items-center">
          <a className="js-swap d-flex align-items-center" onClick={onSwapClick} href="#">
            {
              isRead
                ? <Icon faIcon="envelope-open-o" className="text-secondary"/>
                : <Icon faIcon="envelope-o" className="text-danger"/>
            }
          </a>
          <a className="tpl-rss-title" onClick={onTitleClick} href={link}>
            {title}
          </a>
          <a onClick={() => setCollapse(c => !c)} href="#">
            {collapse ? <Icon faIcon="arrow-down" /> : <Icon faIcon="arrow-up" /> }
          </a>
        </div>
      </div>
      <div className={`card-body p-2 ${collapse ? 'collapse' : ''}`}>
        <div className="card-text" ref={attachHtmlContent}></div>
      </div>
      <div className="card-footer bg-secondary">
        <a href={origin.htmlUrl || origin.url} target="_blank">
          {origin.title}
        </a>
      </div>
    </div>
  );
}

function Panel() {
  const [params] = useParams();
  const nbUnreads_ = useNbUnreads();
  const [nbUnreads, setNbUnreads] = useState(nbUnreads_);
  const feeds = useRSSFeeds();

  useEffect(() => setNbUnreads(nbUnreads_), [nbUnreads_]); // follow unreads change
  
  const openFreshRSSInstance = (event) => {
    event.preventDefault();
    
    openLink(params[PARAM_URL_MAIN], true);
  };
  
  const onRefreshClick = () => browser.runtime
      .sendMessage({name: EVENT_REQUEST_RSS, runNow: true})
      .catch(console.error);

  function onSwapItem({itemid, isRead}) {
    browser.runtime.sendMessage({
      name: EVENT_REQUEST_SWAP,
      itemid, isRead,
    }).catch(console.error);

    setNbUnreads(count => {
      count = count + (isRead ? +1 : -1);
      
      browser.browserAction.setBadgeText({text: `${count}`});
      browser.browserAction.setBadgeBackgroundColor({
        color: count > 0 ? 'red' : 'green'
      });
    });
  }
  
  return (
    <>
      <NavBar
        brand={<NavBar.Brand
          image="/Assets/img/freshrss_logo.png"
          onClick={openFreshRSSInstance}
        />}
      >
        <NavBar.Item title="refresh" faIcon="refresh" onClick={onRefreshClick}/>
        <NavBar.Item title="unreads" faIcon="envelope" onClick={openFreshRSSInstance}>
          <span>{nbUnreads}</span>
        </NavBar.Item>
      </NavBar>
      
      <div
        className="container-fluid rss-item-container pt-2 pb-5"
        data-comment="mCustomScrollbar"
        data-mcs-theme="dark"
      >
        {
          [...feeds.values()].map(rss => (
            <RSSItem
              key={rss.itemid}
              rss={rss}
              onSwapItem={onSwapItem}
            />
          ))
        }
      </div>
    </>
  )
}

document.body.parentElement.classList.add((typeof InstallTrigger !== 'undefined') ? 'isFirefox' : 'isNotFirefox');
ReactDOM.render(
  <Panel />,
  document.getElementById('root')
);