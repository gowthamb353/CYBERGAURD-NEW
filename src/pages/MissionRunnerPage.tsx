import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PhishOrLegitGame } from './games/PhishOrLegitGame';
import { RedFlagHuntGame } from './games/RedFlagHuntGame';
import { PasswordFortressGame } from './games/PasswordFortressGame';
import { ScamChatGame } from './games/ScamChatGame';

export const MissionRunnerPage: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();

  switch (missionId) {
    case 'm_phishing':
      return <PhishOrLegitGame />;
    case 'm_scam':
      return <RedFlagHuntGame />;
    case 'm_password':
      return <PasswordFortressGame />;
    case 'm_privacy':
      return <PhishOrLegitGame />;
    case 'm_social':
      return <ScamChatGame />;
    default:
      return <Navigate to="/missions" replace />;
  }
};
