/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useEffect, useState } from 'react';

import { Spring, config, animated } from 'react-spring/renderprops';

import { ExternalCard, ProfileProps } from 'components/common/cards/external';
import { CloudinaryImg } from 'components/common/cloudinary_img';
import { useMatchesPathPageNumber } from 'components/common/header/nav_helpers';
import { DefaultPageLayout } from 'components/common/layout/default_page';
import MasonryGrid from 'components/common/layout/masonry';

import PageIndicator from 'components/common/page_indicator';
import { A, H1, H2, P } from 'components/common/system';
import { ApiRouteName, fetchFeed } from 'routes/apiRoutes';
import { setGaEvent } from 'routes/ga_tracking';
import { rawSpacing, verticalStackCss } from 'theme';

interface RecommendationsProps {
  type: 'QUOTE' | 'RESOURCE';
  title: string;
  description: string;
  link?: string;
}

export interface ProfileRecommendationsProps extends ProfileProps {
  recommendations: RecommendationsProps[];
}

interface RecommendationsFeedProps {
  count: number;
  list: ProfileRecommendationsProps[];
}

const RecommendationsFeed: React.FC = () => {
  const [currPage, setCurrPage] = useState(useMatchesPathPageNumber());
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [recommendations, setRecommendations] = useState<
    RecommendationsFeedProps
  >();

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const [recommendationsMeta, feedMeta] = await fetchFeed({
          page: currPage,
          group: ApiRouteName.RECOMMENDATIONS_GROUP,
          count: ApiRouteName.RECOMMENDATIONS_COUNT
        });
        setRecommendations({
          list: recommendationsMeta.data,
          count: feedMeta.data.count
        });
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currPage]);

  return (
    <DefaultPageLayout
      pageTitle="Recommendations"
      isError={isError}
      isLoading={isLoading}
      contentCss={css`
        ${verticalStackCss.xl};
        align-items: flex-start;
        justify-content: flex-start;
      `}
    >
      {currPage === 1 ? (
        <div
          css={css`
            ${verticalStackCss.xl}
            align-items: flex-start;
            overflow: hidden;
          `}
        >
          <Spring
            from={{ opacity: 0, transform: 'translateY(15%)' }}
            to={{ opacity: 1, transform: 'translateY(0%)' }}
            config={config.slow}
          >
            {(springProps) => (
              <React.Fragment>
                <H1 style={springProps}>Recommendations</H1>
                <H2
                  style={springProps}
                  contentCss={css`
                    font-weight: normal;
                    margin-top: -${rawSpacing.l}px;
                  `}
                >
                  Explore and learn.
                </H2>
              </React.Fragment>
            )}
          </Spring>
          <Spring
            native
            from={{ opacity: 0, transform: 'translate(-15%, 0%)' }}
            to={{ opacity: 1, transform: 'translate(0%, 0%)' }}
            config={config.slow}
          >
            {(springProps) => (
              <animated.div style={springProps}>
                <CloudinaryImg
                  cloudinaryId="careeers/base/spacex-6SbFGnQTE8s-unsplash_qgibzg"
                  alt="Astronaut in space"
                  contentCss={css`
                    max-height: 500px;
                    object-fit: cover;
                    width: 100%;
                  `}
                />
              </animated.div>
            )}
          </Spring>
        </div>
      ) : (
        <H1>Recommendations</H1>
      )}

      {recommendations ? (
        <React.Fragment>
          <MasonryGrid>
            {recommendations.list.map((profile) => {
              return (
                <ExternalCard
                  key={profile.name}
                  name={profile.name}
                  description={profile.description}
                  profileCloudinaryId={profile.profileCloudinaryId}
                  website={profile.website}
                  slug={profile.slug}
                  company={profile.company}
                  profileLinks={profile.profileLinks}
                  path="/recommendations"
                >
                  <span>~</span>
                  <ul
                    css={css`
                      ${verticalStackCss.m}
                      list-style-type: none;
                      margin-top: ${rawSpacing.zero}px;
                      padding: 0;

                      > li {
                        /* margin: 0; */
                        ${verticalStackCss.s}
                        align-items: flex-start;
                        width: 100%;
                      }
                    `}
                  >
                    {profile.recommendations.map((recommendation) => {
                      const { link, type, title, description } = recommendation;
                      if (type === 'RESOURCE' && link) {
                        return (
                          <li key={title}>
                            <A
                              href={link}
                              contentCss={css`
                                font-weight: bold;
                              `}
                              onClick={() => {
                                setGaEvent({
                                  category: 'cards',
                                  action:
                                    'link clicked from recommendations feed',
                                  label: `${title}`
                                });
                              }}
                            >
                              {title}{' '}
                            </A>
                            <P>{description}</P>
                          </li>
                        );
                      }
                      return (
                        <li key={title}>
                          <P
                            contentCss={css`
                              font-weight: bold;
                            `}
                          >
                            {title}
                          </P>
                          <P>{description}</P>
                        </li>
                      );
                    })}
                  </ul>
                </ExternalCard>
              );
            })}
          </MasonryGrid>
          <PageIndicator
            numOfCards={recommendations.count}
            path="recommendations"
            currPageIndicator={currPage}
            setCurrPageIndicator={setCurrPage}
          />
        </React.Fragment>
      ) : null}
    </DefaultPageLayout>
  );
};

export default RecommendationsFeed;
