/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import { Spring, config, animated } from 'react-spring/renderprops';

import { ProfileProps } from '../resumes/feed';
import PreviewCard from 'components/common/cards/preview';
import { CloudinaryImg } from 'components/common/cloudinary_img';
import { useMatchesPathPageNumber } from 'components/common/header/nav_helpers';

import { DefaultPageLayout } from 'components/common/layout/default_page';
import MasonryGrid from 'components/common/layout/masonry';

import PageIndicator from 'components/common/page_indicator';
import { H1, H2 } from 'components/common/system';

import { ApiRouteName, fetchFeed } from 'routes/apiRoutes';
import { rawSpacing, verticalStackCss } from 'theme';

interface InterviewsFeedProps {
  count: number;
  list: ProfileProps[];
}

const InterviewsFeed: React.FC = () => {
  const [currPage, setCurrPage] = useState(useMatchesPathPageNumber());
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [interviews, setInterviews] = useState<InterviewsFeedProps>();

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const [interviewsMeta, feedMeta] = await fetchFeed({
          page: currPage,
          group: ApiRouteName.INTERVIEWS_GROUP,
          count: ApiRouteName.INTERVIEWS_COUNT
        });
        setInterviews({
          list: interviewsMeta.data,
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
      pageTitle="Interviews"
      isError={isError}
      isLoading={isLoading}
      contentCss={css`
        ${verticalStackCss.xl}
        justify-content: flex-start;
        align-items: flex-start;
        overflow: hidden;
      `}
    >
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
              <H1 style={springProps}>Interviews</H1>
              <H2
                style={springProps}
                contentCss={css`
                  font-weight: normal;
                  margin-top: -${rawSpacing.l}px;
                `}
              >
                Be Inspired. To Inspire.
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
                cloudinaryId="careeers/base/idea_odayya"
                alt="Steps with inspiring idea quote"
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
      {interviews && (
        <React.Fragment>
          <MasonryGrid>
            {interviews.list.map((interview) => {
              return (
                <PreviewCard
                  key={interview.name}
                  name={interview.name}
                  company={interview.company}
                  description={interview.description}
                  profileCloudinaryId={interview.profileCloudinaryId}
                  slug={interview.slug}
                  path="interviews"
                  margin
                  source="feed"
                />
              );
            })}
          </MasonryGrid>
          <PageIndicator
            numOfCards={interviews.count}
            path="interviews"
            currPageIndicator={currPage}
            setCurrPageIndicator={setCurrPage}
          />
        </React.Fragment>
      )}
    </DefaultPageLayout>
  );
};

export default InterviewsFeed;
